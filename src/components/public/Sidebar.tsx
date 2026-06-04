"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Code2, Gamepad2, PenLine, Play, MessageCircle } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import type { Social } from "@prisma/client";

const NAV = [
  { href: "/", label: "Home", num: "1", Icon: Home },
  { href: "/updates", label: "Updates", num: "2", Icon: Bell },
  { href: "/projects", label: "Projects", num: "3", Icon: Code2 },
  { href: "/games", label: "Games", num: "4", Icon: Gamepad2 },
  { href: "/thoughts", label: "Thoughts", num: "5", Icon: PenLine },
  { href: "/watched", label: "Watched", num: "6", Icon: Play },
];

// SVG icons for platforms that lucide-react v1 removed
function PlatformIcon({ platform }: { platform: string }) {
  const s = { width: 18, height: 18, stroke: "currentColor", strokeWidth: 1.7, fill: "none" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (platform) {
    case "email": return <svg viewBox="0 0 24 24" {...s}><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>;
    case "twitter": return <svg viewBox="0 0 24 24" {...s}><path d="M4 3h4l5 7 5-7h2l-6 8 7 10h-4l-5-7-6 7H3l7-8z" fill="currentColor" stroke="none"/></svg>;
    case "instagram": return <svg viewBox="0 0 24 24" {...s}><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".8" fill="currentColor"/></svg>;
    case "linkedin": return <svg viewBox="0 0 24 24" {...s}><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10v6M8 7v.01M12 16v-3.5a2 2 0 0 1 4 0V16"/></svg>;
    case "github": return <svg viewBox="0 0 24 24" {...s}><path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C6.1 3.3 5 3.6 5 3.6a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.5 10c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>;
    case "letterboxd": return <svg viewBox="0 0 24 24" {...s}><circle cx="7" cy="12" r="3.2"/><circle cx="12" cy="12" r="3.2"/><circle cx="17" cy="12" r="3.2"/></svg>;
    default: return <svg viewBox="0 0 24 24" {...s}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
  }
}

interface SidebarProps {
  logoText: string;
  socials: Social[];
}

export function Sidebar({ logoText, socials }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  // Like SJ: a primary social shown directly in the sidebar; the rest live in the Contact modal.
  const primary = socials.find(s => s.platform === "twitter") ?? socials.find(s => s.platform !== "email");

  return (
    <aside className="site-sidebar" aria-label="Site navigation">
      <Link href="/" style={{ fontFamily: "var(--font-caveat, var(--script))", fontSize: 27, lineHeight: 1, margin: "4px 6px 30px", letterSpacing: ".5px", textDecoration: "none" }}>
        {logoText}
      </Link>

      <nav aria-label="Sections">
        <div style={{ marginBottom: 8 }}>
          {NAV.map(({ href, label, num, Icon }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined}
                className={`site-nav-link${active ? " active" : ""}`}>
                <span style={{ width: 18, height: 18, flex: "none", display: "grid", placeItems: "center" }}>
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>{label}</span>
                <span className="nav-num">{num}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--faint)", margin: "16px 10px 8px" }}>
          Stay in touch
        </div>

        <button type="button" className="site-nav-link"
          onClick={() => window.dispatchEvent(new Event("open-contact"))}
          style={{ width: "100%", background: "none", cursor: "pointer", font: "inherit", textAlign: "left" }}>
          <span style={{ width: 18, height: 18, flex: "none", display: "grid", placeItems: "center" }}>
            <MessageCircle size={18} strokeWidth={1.7} />
          </span>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>Contact</span>
          <span className="nav-num">/</span>
        </button>

        {primary && (
          <a href={primary.url} className="site-nav-link" target="_blank" rel="noopener noreferrer">
            <span style={{ width: 18, height: 18, flex: "none", display: "grid", placeItems: "center" }}>
              <PlatformIcon platform={primary.platform} />
            </span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>{primary.label}</span>
            <span style={{ fontSize: 12, color: "var(--faint)" }}>↗</span>
          </a>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 18 }} />
      <ThemeToggle />
    </aside>
  );
}
