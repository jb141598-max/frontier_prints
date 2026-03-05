import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAdminCreds } from '@/lib/env';

const ADMIN_SESSION_COOKIE = 'frontier_admin_session';
const ADMIN_ACCOUNTS_COOKIE = 'frontier_admin_accounts';
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

type SocialProvider = 'google' | 'microsoft';
type AuthProvider = 'password' | SocialProvider;

interface StoredAccount {
  identifier: string;
  provider: AuthProvider;
  passwordHash?: string;
  createdAt: string;
}

interface StoredSession {
  identifier: string;
  provider: AuthProvider;
  issuedAt: number;
}

function normalizeIdentifier(value: string): string {
  return value.trim().toLowerCase();
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function hmac(value: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function encode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decode(value: string): string | null {
  try {
    return Buffer.from(value, 'base64url').toString('utf8');
  } catch {
    return null;
  }
}

function packSignedPayload(payload: string, secret: string): string {
  const encoded = encode(payload);
  const signature = hmac(encoded, secret);
  return `${encoded}.${signature}`;
}

function unpackSignedPayload(token: string, secret: string): string | null {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || token.split('.').length !== 2) {
    return null;
  }

  const expected = hmac(encoded, secret);
  if (!safeEqual(signature, expected)) {
    return null;
  }

  return decode(encoded);
}

function hashPassword(password: string, secret: string): string {
  return crypto.createHash('sha256').update(`${secret}:${password}`).digest('hex');
}

function isStoredAccount(value: unknown): value is StoredAccount {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const account = value as Partial<StoredAccount>;
  const providerValid = account.provider === 'password' || account.provider === 'google' || account.provider === 'microsoft';

  return (
    typeof account.identifier === 'string' &&
    account.identifier.length > 0 &&
    providerValid &&
    typeof account.createdAt === 'string' &&
    (typeof account.passwordHash === 'undefined' || typeof account.passwordHash === 'string')
  );
}

function parseSession(token: string, secret: string): StoredSession | null {
  const payload = unpackSignedPayload(token, secret);
  if (!payload) {
    return null;
  }

  try {
    const parsed = JSON.parse(payload) as Partial<StoredSession>;
    const providerValid = parsed.provider === 'password' || parsed.provider === 'google' || parsed.provider === 'microsoft';

    if (!providerValid || typeof parsed.identifier !== 'string' || typeof parsed.issuedAt !== 'number') {
      return null;
    }

    return {
      identifier: normalizeIdentifier(parsed.identifier),
      provider: parsed.provider,
      issuedAt: parsed.issuedAt
    };
  } catch {
    return null;
  }
}

async function readStoredAccounts(secret: string): Promise<StoredAccount[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_ACCOUNTS_COOKIE)?.value;
  if (!token) {
    return [];
  }

  const payload = unpackSignedPayload(token, secret);
  if (!payload) {
    return [];
  }

  try {
    const parsed = JSON.parse(payload) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(isStoredAccount)
      .map((account) => ({
        ...account,
        identifier: normalizeIdentifier(account.identifier)
      }));
  } catch {
    return [];
  }
}

async function writeStoredAccounts(accounts: StoredAccount[], secret: string) {
  const cookieStore = await cookies();
  const compact = accounts.slice(-100);
  const token = packSignedPayload(JSON.stringify(compact), secret);

  cookieStore.set(ADMIN_ACCOUNTS_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: THIRTY_DAYS_SECONDS
  });
}

export async function setAdminSession(identifier: string, provider: AuthProvider = 'password') {
  const { secret } = requireAdminCreds();
  const normalizedIdentifier = normalizeIdentifier(identifier);

  const token = packSignedPayload(
    JSON.stringify({
      identifier: normalizedIdentifier,
      provider,
      issuedAt: Date.now()
    }),
    secret
  );

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ONE_WEEK_SECONDS
  });
}

export async function registerPasswordAccount(identifier: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier) {
    return { ok: false, error: 'Please enter a username or email.' };
  }

  if (password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' };
  }

  const { secret } = requireAdminCreds();
  const accounts = await readStoredAccounts(secret);

  const alreadyExists = accounts.some((account) => account.provider === 'password' && account.identifier === normalizedIdentifier);
  if (alreadyExists) {
    return { ok: false, error: 'Account already exists. Please sign in.' };
  }

  accounts.push({
    identifier: normalizedIdentifier,
    provider: 'password',
    passwordHash: hashPassword(password, secret),
    createdAt: new Date().toISOString()
  });

  await writeStoredAccounts(accounts, secret);
  await setAdminSession(normalizedIdentifier, 'password');
  return { ok: true };
}

export async function loginWithPassword(identifier: string, password: string): Promise<boolean> {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier || !password) {
    return false;
  }

  const { secret, emails, password: fallbackPassword } = requireAdminCreds();

  // Preserve owner fallback credentials for environments without account setup.
  if (emails.includes(normalizedIdentifier) && password === fallbackPassword) {
    await setAdminSession(normalizedIdentifier, 'password');
    return true;
  }

  const accounts = await readStoredAccounts(secret);
  const account = accounts.find((entry) => entry.provider === 'password' && entry.identifier === normalizedIdentifier);
  if (!account?.passwordHash) {
    return false;
  }

  const valid = safeEqual(account.passwordHash, hashPassword(password, secret));
  if (!valid) {
    return false;
  }

  await setAdminSession(normalizedIdentifier, 'password');
  return true;
}

export async function loginWithSocial(provider: SocialProvider, identifier: string): Promise<{ ok: boolean; error?: string }> {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (!normalizedIdentifier) {
    return { ok: false, error: 'Please enter your email or username first.' };
  }

  const { secret } = requireAdminCreds();
  const accounts = await readStoredAccounts(secret);
  const exists = accounts.some((account) => account.provider === provider && account.identifier === normalizedIdentifier);

  if (!exists) {
    accounts.push({
      identifier: normalizedIdentifier,
      provider,
      createdAt: new Date().toISOString()
    });
    await writeStoredAccounts(accounts, secret);
  }

  await setAdminSession(normalizedIdentifier, provider);
  return { ok: true };
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const { secret, emails } = requireAdminCreds();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!sessionToken) {
      return false;
    }

    const session = parseSession(sessionToken, secret);
    if (!session) {
      return false;
    }

    // Owner fallback auth.
    if (session.provider === 'password' && emails.includes(session.identifier)) {
      return true;
    }

    const accounts = await readStoredAccounts(secret);
    return accounts.some((account) => account.provider === session.provider && account.identifier === session.identifier);
  } catch {
    return false;
  }
}

export async function requireAdminAuth() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }
}
