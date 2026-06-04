"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const modes = [
    { key: "light", label: "Light" },
    { key: "dark", label: "Dark" },
    { key: "system", label: "Auto" },
  ] as const;

  if (!mounted) return (
    <div style={{ display: "flex", gap: 2, padding: 4, borderRadius: 999, width: "fit-content",
      background: "var(--glass)", border: "1px solid var(--glass-bd)",
      boxShadow: "inset 0 1px 0 var(--glass-hi)", backdropFilter: "blur(12px)" }}>
      {modes.map(m => <button key={m.key} style={{ fontFamily: "var(--sans)", fontSize: 12,
        fontWeight: 500, color: "var(--muted)", background: "none", border: "none",
        cursor: "pointer", padding: "5px 13px", borderRadius: 999 }}>{m.label}</button>)}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 2, padding: 4, borderRadius: 999, width: "fit-content",
      background: "var(--glass)", border: "1px solid var(--glass-bd)",
      boxShadow: "inset 0 1px 0 var(--glass-hi)",
      WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}>
      {modes.map(m => {
        const isOn = theme === m.key || (m.key === "system" && theme === "system");
        return (
          <button
            key={m.key}
            onClick={() => setTheme(m.key)}
            aria-pressed={isOn}
            style={{
              fontFamily: "var(--sans)", fontSize: 12, fontWeight: 500,
              color: isOn ? "var(--bg)" : "var(--muted)",
              background: isOn ? "var(--fg)" : "none",
              border: "none", cursor: "pointer", padding: "5px 13px",
              borderRadius: 999, transition: ".25s",
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
