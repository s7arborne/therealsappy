import type { Watched } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

export function WatchedRow({ w }: { w: Watched }) {
  return (
    <a href={w.link || "#"} target={w.link ? "_blank" : undefined} rel="noopener noreferrer"
      className="watched-row"
      style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 15, alignItems: "center", padding: 14, borderRadius: 12 }}>
      <span style={{ width: 40, height: 40, borderRadius: 9, background: "var(--glass)", border: "1px solid var(--glass-bd)", display: "grid", placeItems: "center", fontSize: 18 }}>🎬</span>
      <span>
        <span style={{ fontWeight: 600, display: "inline-flex", gap: 6, alignItems: "center" }}>
          {w.filmTitle}{w.year ? ` (${w.year})` : ""}
          <span className="watched-arr" style={{ color: "var(--faint)", fontSize: 12 }}>↗</span>
        </span>
        {(w.rating || w.note) && (
          <div style={{ color: "var(--muted)", fontSize: 13 }}>{w.rating}{w.note ? ` — ${w.note}` : ""}</div>
        )}
      </span>
      <span style={{ color: "var(--faint)", fontSize: 12.5, whiteSpace: "nowrap" }}>
        {formatDistanceToNow(new Date(w.watchedAt), { addSuffix: true })}
      </span>
    </a>
  );
}
