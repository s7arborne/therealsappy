import type { Project } from "@prisma/client";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {projects.map(p => (
        <a key={p.id} href={p.url || "#"} target={p.url ? "_blank" : undefined} rel="noopener noreferrer"
          className="project-link"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14,
            padding: "13px 14px", borderRadius: 8 }}>
          <span style={{ display: "flex", gap: 11, alignItems: "center", minWidth: 0 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flex: "none" }} />
            <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
          </span>
          <span style={{ display: "flex", gap: 12, alignItems: "center", color: "var(--muted)", fontSize: 11.5, whiteSpace: "nowrap" }}>
            {p.tag && <span style={{ border: "1px solid var(--line)", borderRadius: 5, padding: "3px 10px", fontSize: 10, textTransform: "uppercase", letterSpacing: ".05em" }}>{p.tag}</span>}
            <span>↗</span>
          </span>
        </a>
      ))}
    </div>
  );
}
