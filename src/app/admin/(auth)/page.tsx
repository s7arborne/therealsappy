export const dynamic = "force-dynamic";
import { getCounts } from "@/lib/content";
import { ADMIN_PATH } from "@/lib/auth";
import Link from "next/link";
import { Newspaper, FolderGit2, Gamepad2, Film, PenLine, ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";

export default async function AdminDashboard() {
  const counts = await getCounts();
  const sections: { label: string; count: number; href: string; Icon: ComponentType<{ size?: number }> }[] = [
    { label: "Updates", count: counts.updates, href: `/${ADMIN_PATH}/updates`, Icon: Newspaper },
    { label: "Projects", count: counts.projects, href: `/${ADMIN_PATH}/projects`, Icon: FolderGit2 },
    { label: "Games", count: counts.games, href: `/${ADMIN_PATH}/games`, Icon: Gamepad2 },
    { label: "Watched", count: counts.watched, href: `/${ADMIN_PATH}/watched`, Icon: Film },
    { label: "Thoughts", count: counts.thoughts, href: `/${ADMIN_PATH}/thoughts`, Icon: PenLine },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "var(--muted)", marginBottom: 32 }}>Welcome back. Manage your site content below.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {sections.map(({ label, count, href, Icon }) => (
          <Link key={label} href={href} style={{ textDecoration: "none" }}>
            <div className="glass admin-stat-card" style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--muted)", marginBottom: 10 }}>
                <Icon size={20} />
                <ArrowUpRight size={16} />
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--accent)" }}>{count}</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
