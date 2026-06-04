import type { Update } from "@prisma/client";
import { format } from "date-fns";

export function UpdateCard({ update }: { update: Update }) {
  return (
    <a href={update.link || "#"} className="glass update-card"
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, minHeight: 190, textDecoration: "none" }}>
      <span style={{ width: 34, height: 34, borderRadius: 6, display: "grid", placeItems: "center",
        background: "var(--glass)", border: "1px solid var(--glass-bd)", fontWeight: 700, fontSize: 14 }}>
        {update.iconUrl || "◆"}
      </span>
      <h3 style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: "-.01em", lineHeight: 1.3 }}>{update.title}</h3>
      <p style={{ color: "var(--muted)", fontSize: 12.5, flex: 1 }}>{update.description}</p>
      <span style={{ color: "var(--faint)", fontSize: 11.5 }}>{format(new Date(update.date), "MMM yyyy")}</span>
    </a>
  );
}
