import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <section className="mx-auto mt-16 max-w-md space-y-5">
      <div className="text-center">
        <Link href="/" className="text-sm font-semibold text-brand-base">
          Frontier Prints
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-brand-ink">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-600">Use your owner credentials to manage products and requests.</p>
      </div>

      <form action="/api/admin/login" method="post" className="card space-y-4 p-6">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" className="input" required />
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
    </section>
  );
}
