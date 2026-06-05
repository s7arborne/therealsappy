"use client";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // false on the server + initial hydration render, true afterwards — without a
  // setState-in-effect. Prevents theme-dependent UI from mismatching on hydrate.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const modes = [
    { key: "light", label: "Light" },
    { key: "dark", label: "Dark" },
    { key: "system", label: "Auto" },
  ] as const;

  if (!mounted) return (
    <div style={{ display: "flex", gap: 3, padding: 4, borderRadius: 9, width: "100%",
      background: "var(--glass)", border: "1px solid var(--glass-bd)",
      boxShadow: "inset 0 1px 0 var(--glass-hi)", backdropFilter: "blur(12px)" }}>
      {modes.map(m => <button key={m.key} style={{ fontFamily: "var(--sans)", fontSize: 12.5,
        fontWeight: 500, color: "var(--muted)", background: "none", border: "none",
        cursor: "pointer", padding: "8px 0", borderRadius: 6, flex: 1 }}>{m.label}</button>)}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 3, padding: 4, borderRadius: 9, width: "100%",
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
              fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 500,
              color: isOn ? "var(--bg)" : "var(--muted)",
              background: isOn ? "var(--fg)" : "none",
              border: "none", cursor: "pointer", padding: "8px 0",
              borderRadius: 6, flex: 1, transition: ".25s",
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
