import { requireAdmin, ADMIN_PATH } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: "noindex,nofollow" };

const NAV = [
  { href: "", label: "Dashboard" },
  { href: "/updates", label: "Updates" },
  { href: "/projects", label: "Projects" },
  { href: "/games", label: "Games" },
  { href: "/watched", label: "Watched" },
  { href: "/thoughts", label: "Thoughts" },
  { href: "/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", color: "var(--fg)" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "var(--panel)", borderRight: "1px solid var(--line)",
        display: "flex", flexDirection: "column", padding: "24px 16px" }}>
        <div style={{ fontFamily: "var(--font-caveat, var(--script))", fontSize: 24, marginBottom: 32, paddingLeft: 8 }}>
          Admin
        </div>
        <nav style={{ flex: 1 }}>
          {NAV.map(n => (
            <Link key={n.href} href={`/${ADMIN_PATH}${n.href}`}
              style={{ display: "block", padding: "8px 12px", borderRadius: 8, color: "var(--muted)",
                fontSize: 14, fontWeight: 500, marginBottom: 2, transition: "background .2s, color .2s" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button type="submit" style={{ width: "100%", padding: "8px 12px", borderRadius: 8,
            background: "transparent", border: "1px solid var(--line)", color: "var(--muted)",
            fontSize: 13, cursor: "pointer", textAlign: "left" }}>
            Sign out
          </button>
        </form>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
