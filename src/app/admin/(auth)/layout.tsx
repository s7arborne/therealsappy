import { requireAdmin, ADMIN_PATH } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogOut, Home } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: "noindex,nofollow" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", color: "var(--fg)" }}>
      {/* Sidebar */}
      <aside style={{ width: 232, background: "var(--panel)", borderRight: "1px solid var(--line)",
        display: "flex", flexDirection: "column", padding: "24px 16px",
        position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ fontFamily: "var(--font-caveat, var(--script))", fontSize: 26, marginBottom: 28, paddingLeft: 8 }}>
          Admin
        </div>
        <AdminNav basePath={ADMIN_PATH} />
        <Link href="/" target="_blank" rel="noopener" className="admin-nav-link" style={{ marginBottom: 10 }}>
          <Home size={17} />
          View site
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="admin-signout">
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", maxWidth: 1100 }}>
        {children}
      </main>
    </div>
  );
}
