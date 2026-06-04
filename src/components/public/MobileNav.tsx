"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import type { Social } from "@prisma/client";

const NAV = [
  { href: "/", label: "Home", num: "1" },
  { href: "/updates", label: "Updates", num: "2" },
  { href: "/projects", label: "Projects", num: "3" },
  { href: "/games", label: "Games", num: "4" },
  { href: "/thoughts", label: "Thoughts", num: "5" },
  { href: "/watched", label: "Watched", num: "6" },
];

export function MobileNav({ logoText, socials }: { logoText: string; socials: Social[] }) {
  void socials;
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  return (
    <>
      <div style={{
        display: "none",
        position: "sticky", top: 0, zIndex: 30,
        background: "var(--sidebar)", backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)", borderBottom: "1px solid var(--line)",
        padding: "12px 16px", alignItems: "center", justifyContent: "space-between",
      }} className="mobile-topbar">
        <Link href="/" style={{ fontFamily: "var(--font-caveat, var(--script))", fontSize: 24 }}>{logoText}</Link>
        <button onClick={() => setOpen(o => !o)} aria-label="Toggle menu" style={{ background: "none", border: "none", color: "var(--fg)", cursor: "pointer" }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div style={{ display: "none", flexDirection: "column", padding: "8px 12px 16px",
          background: "var(--sidebar)", backdropFilter: "blur(26px)", WebkitBackdropFilter: "blur(26px)",
          borderBottom: "1px solid var(--line)", position: "sticky", top: 53, zIndex: 29 }}
          className="mobile-menu">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {NAV.map(n => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 8,
                  color: isActive(n.href) ? "var(--fg)" : "var(--muted)",
                  background: isActive(n.href) ? "var(--glass)" : "transparent",
                  border: "1px solid var(--line)", fontSize: 13.5, fontWeight: 500 }}>
                {n.label}
                <span style={{ fontSize: 10, color: "var(--faint)", border: "1px solid var(--line)", borderRadius: 3, padding: "1px 4px" }}>{n.num}</span>
              </Link>
            ))}
            <button type="button"
              onClick={() => { setOpen(false); window.dispatchEvent(new Event("open-contact")); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 8,
                color: "var(--muted)", background: "transparent", border: "1px solid var(--line)",
                fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>
              Contact
              <span style={{ fontSize: 10, color: "var(--faint)", border: "1px solid var(--line)", borderRadius: 3, padding: "1px 4px" }}>/</span>
            </button>
          </div>
          <div style={{ marginTop: 12 }}><ThemeToggle /></div>
        </div>
      )}
    </>
  );
}
