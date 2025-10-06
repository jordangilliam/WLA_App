import Link from 'next/link';

export default function AuthPage(){
  return (
    <section className="section">
      <h1>Sign In</h1>
      <p>Use your account to connect storage and save progress.</p>
      <div className="row">
        <a className="btn" href="/api/auth/signin">Sign in with Google or Microsoft</a>
        <Link href="/" className="btn">Back Home</Link>
      </div>
    </section>
  );
}
