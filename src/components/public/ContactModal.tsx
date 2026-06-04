"use client";
import { useEffect, useState, useCallback } from "react";
import { SquarePen, Copy, Check, X } from "lucide-react";
import type { Social } from "@prisma/client";

function PlatformIcon({ platform }: { platform: string }) {
  const s = { width: 18, height: 18, stroke: "currentColor", strokeWidth: 1.7, fill: "none" as const, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (platform) {
    case "twitter": return <svg viewBox="0 0 24 24" {...s}><path d="M4 3h4l5 7 5-7h2l-6 8 7 10h-4l-5-7-6 7H3l7-8z" fill="currentColor" stroke="none"/></svg>;
    case "instagram": return <svg viewBox="0 0 24 24" {...s}><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".8" fill="currentColor"/></svg>;
    case "linkedin": return <svg viewBox="0 0 24 24" {...s}><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10v6M8 7v.01M12 16v-3.5a2 2 0 0 1 4 0V16"/></svg>;
    case "github": return <svg viewBox="0 0 24 24" {...s}><path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C6.1 3.3 5 3.6 5 3.6a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.5 10c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>;
    case "letterboxd": return <svg viewBox="0 0 24 24" {...s}><circle cx="7" cy="12" r="3.2"/><circle cx="12" cy="12" r="3.2"/><circle cx="17" cy="12" r="3.2"/></svg>;
    default: return <svg viewBox="0 0 24 24" {...s}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
  }
}

export function ContactModal({ socials }: { socials: Social[] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const email = socials.find(s => s.platform === "email");
  const others = socials.filter(s => s.platform !== "email");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && t.closest("input,textarea,[contenteditable='true']");
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("open-contact", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-contact", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email.handle || email.url.replace(/^mailto:/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (!open) return null;

  const btn: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 8, padding: "9px 14px",
    border: "1px solid var(--glass-bd)", borderRadius: 7, background: "var(--glass)",
    color: "var(--fg)", fontSize: 13.5, fontWeight: 500, cursor: "pointer", textDecoration: "none",
  };
  const rowLabel: React.CSSProperties = { fontSize: 17, fontWeight: 600, letterSpacing: "-.01em" };
  const rowSub: React.CSSProperties = { color: "var(--muted)", fontSize: 13.5, marginTop: 4 };

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(0,0,0,.55)", WebkitBackdropFilter: "blur(6px)", backdropFilter: "blur(6px)",
        display: "grid", placeItems: "center", padding: 24,
        animation: "pageEnter .2s var(--ease) both",
      }}
      role="dialog" aria-modal="true" aria-label="Contact"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="glass"
        style={{ width: "100%", maxWidth: 680, padding: "clamp(28px,3.5vw,44px)", position: "relative" }}
      >
        <button onClick={close} aria-label="Close" style={{
          position: "absolute", top: 18, right: 18, background: "none", border: "none",
          color: "var(--faint)", cursor: "pointer", display: "grid", placeItems: "center",
        }}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: "clamp(26px,3vw,34px)", fontWeight: 600, letterSpacing: "-.02em", marginBottom: 32 }}>
          Contact
        </h2>

        {/* Email */}
        {email && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            flexWrap: "wrap", paddingBottom: 26, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div style={rowLabel}>Email</div>
              <div style={rowSub}>{email.handle || email.url.replace(/^mailto:/, "")}</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={email.url} style={btn}><SquarePen size={16} /> Compose</a>
              <button onClick={copyEmail} style={btn}>
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Stay in touch */}
        {others.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            flexWrap: "wrap", paddingTop: 26 }}>
            <div>
              <div style={rowLabel}>Stay in touch</div>
              <div style={rowSub}>Find me elsewhere on the internet</div>
            </div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {others.map(s => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="contact-social"
                  style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--muted)", fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>
                  <PlatformIcon platform={s.platform} />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
