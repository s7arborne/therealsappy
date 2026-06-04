import Link from "next/link";
import type { Thought } from "@prisma/client";
import { format } from "date-fns";

export function ThoughtNote({ thought }: { thought: Thought }) {
  return (
    <article className="glass" style={{ padding: 26 }}>
      <div style={{ display: "flex", gap: 12, color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14 }}>
        {thought.isNew && <span style={{ color: "var(--accent)" }}>● New</span>}
        {thought.topic && <span>{thought.topic}</span>}
        {thought.publishedAt && <span>{format(new Date(thought.publishedAt), "MMM yyyy")}</span>}
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-.02em", marginBottom: 12 }}>{thought.title}</h3>
      <p style={{ color: "var(--muted)", marginBottom: 14 }}>
        {thought.bodyMd.replace(/\*\*/g, "").split("\n\n")[0].slice(0, 160)}…
      </p>
      <Link href={`/thoughts/${thought.slug}`} className="thought-more"
        style={{ fontSize: 12, color: "var(--fg)", borderBottom: "1px solid var(--accent)", paddingBottom: 2 }}>
        Read the full note →
      </Link>
    </article>
  );
}
