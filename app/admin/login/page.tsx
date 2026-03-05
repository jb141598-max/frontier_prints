import Link from 'next/link';

const errorCopy: Record<string, string> = {
  invalid: 'Invalid username/email or password.',
  provider: 'Choose a valid social provider.',
  register: 'Could not create account. Please try again.',
  social: 'Social sign-in failed. Try again.'
};

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawError = params.error;
  const errorKey = Array.isArray(rawError) ? rawError[0] : rawError;
  const errorMessage = errorKey ? errorCopy[errorKey] || errorKey : null;

  return (
    <section className="mx-auto mt-10 max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="btn-secondary text-sm">
          Back to Home
        </Link>
        <Link href="/" className="text-sm font-semibold text-brand-base">
          Frontier Prints
        </Link>
      </div>

      <div className="text-center">
        <h1 className="mt-2 text-3xl font-bold text-brand-ink">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-600">Create an account or sign in. Your login state is saved with secure cookies.</p>
      </div>

      {errorMessage && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <form action="/api/admin/login" method="post" className="card space-y-4 p-6">
          <h2 className="text-xl font-semibold text-brand-ink">Sign In</h2>
          <div>
            <label htmlFor="identifier" className="label">
              Username or Email
            </label>
            <input id="identifier" name="identifier" className="input" required />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input id="password" name="password" type="password" className="input" required />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>

        <form action="/api/admin/register" method="post" className="card space-y-4 p-6">
          <h2 className="text-xl font-semibold text-brand-ink">Create Account</h2>
          <div>
            <label htmlFor="register-identifier" className="label">
              Username or Email
            </label>
            <input id="register-identifier" name="identifier" className="input" required />
          </div>
          <div>
            <label htmlFor="register-password" className="label">
              Preferred Password
            </label>
            <input id="register-password" name="password" type="password" className="input" minLength={8} required />
          </div>
          <button type="submit" className="btn-primary w-full">
            Create account
          </button>
        </form>
      </div>

      <form action="/api/admin/social-login" method="post" className="card space-y-4 p-6">
        <h2 className="text-xl font-semibold text-brand-ink">Google or Microsoft Sign-In</h2>
        <p className="text-sm text-slate-600">Enter your username/email, then choose Google or Microsoft.</p>
        <div>
          <label htmlFor="social-identifier" className="label">
            Username or Email
          </label>
          <input id="social-identifier" name="identifier" className="input" required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="submit" name="provider" value="google" className="btn-secondary">
            Continue with Google
          </button>
          <button type="submit" name="provider" value="microsoft" className="btn-secondary">
            Continue with Microsoft
          </button>
        </div>
      </form>
    </section>
  );
}
