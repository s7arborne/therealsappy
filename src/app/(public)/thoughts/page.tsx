import { getPublishedThoughts } from "@/lib/content";
import Link from "next/link";
import { format } from "date-fns";
import { SectionHeader } from "@/components/public/SectionHeader";

export const revalidate = 60;

export default async function ThoughtsPage() {
  const thoughts = await getPublishedThoughts();
  return (
    <>
      <SectionHeader title="All Writing" />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {thoughts.map(t => (
          <Link key={t.id} href={`/thoughts/${t.slug}`} className="thought-link"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14,
              padding: "14px 16px", borderRadius: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              {t.topic && <div style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 2 }}>{t.topic}</div>}
            </div>
            {t.publishedAt && <span style={{ color: "var(--faint)", fontSize: 12.5, whiteSpace: "nowrap" }}>{format(new Date(t.publishedAt), "MMM d, yyyy")}</span>}
          </Link>
        ))}
      </div>
    </>
  );
}
