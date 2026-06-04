export const dynamic = "force-dynamic";
import { getCounts } from "@/lib/content";
import { ADMIN_PATH } from "@/lib/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const counts = await getCounts();
  const sections = [
    { label: "Updates", count: counts.updates, href: `/${ADMIN_PATH}/updates` },
    { label: "Projects", count: counts.projects, href: `/${ADMIN_PATH}/projects` },
    { label: "Games", count: counts.games, href: `/${ADMIN_PATH}/games` },
    { label: "Watched", count: counts.watched, href: `/${ADMIN_PATH}/watched` },
    { label: "Thoughts", count: counts.thoughts, href: `/${ADMIN_PATH}/thoughts` },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "var(--muted)", marginBottom: 32 }}>Welcome back. Manage your site content below.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
        {sections.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div className="glass admin-stat-card" style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--accent)" }}>{s.count}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
