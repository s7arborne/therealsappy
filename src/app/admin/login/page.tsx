import { loginAction } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: "noindex,nofollow" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const params = await searchParams;

  // If ok=1, cookie was set — redirect server-side to admin
  if (params.ok) {
    redirect(`/${process.env.ADMIN_PATH ?? "admin"}`);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", color: "var(--fg)",
    }}>
      <div className="glass" style={{ padding: "40px 36px", width: 360, borderRadius: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Admin</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>
          Enter your password to continue.
        </p>
        <form action={loginAction}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="password" style={{ fontSize: 13, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 10,
                background: "var(--glass)", border: "1px solid var(--glass-bd)",
                color: "var(--fg)", fontSize: 14, outline: "none",
              }}
            />
          </div>
          {params.error && (
            <p style={{ color: "var(--accent)", fontSize: 13, marginBottom: 12 }}>
              Invalid credentials.
            </p>
          )}
          <button type="submit"
            style={{
              width: "100%", padding: "10px 0", borderRadius: 10,
              background: "var(--fg)", color: "var(--bg)", border: "none",
              fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
