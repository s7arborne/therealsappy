"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import type { Social } from "@prisma/client";

const NAV = [
  { id: "home", label: "Home", num: "1" },
  { id: "updates", label: "Updates", num: "2" },
  { id: "projects", label: "Projects", num: "3" },
  { id: "games", label: "Games", num: "4" },
  { id: "thoughts", label: "Thoughts", num: "5" },
  { id: "watched", label: "Watched", num: "6" },
];

export function MobileNav({ logoText, socials }: { logoText: string; socials: Social[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div style={{
        display: "none",
        position: "sticky", top: 0, zIndex: 30,
        background: "var(--sidebar)", backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)", borderBottom: "1px solid var(--line)",
        padding: "12px 16px", alignItems: "center", justifyContent: "space-between",
      }} className="mobile-topbar">
        <span style={{ fontFamily: "var(--font-caveat, var(--script))", fontSize: 24 }}>{logoText}</span>
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
              <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 10,
                  color: "var(--muted)", border: "1px solid var(--line)", fontSize: 13.5, fontWeight: 500 }}>
                {n.label}
                <span style={{ fontSize: 10, color: "var(--faint)", border: "1px solid var(--line)", borderRadius: 4, padding: "1px 4px" }}>{n.num}</span>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 12 }}><ThemeToggle /></div>
        </div>
      )}
    </>
  );
}
