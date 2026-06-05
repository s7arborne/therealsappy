import { getPublishedThoughts } from "@/lib/content";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionEntry } from "@/components/public/SectionEntry";
import Image from "next/image";
import { format } from "date-fns";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Thoughts" };

export default async function ThoughtsPage() {
  const thoughts = await getPublishedThoughts();
  return (
    <SectionShell title="Thoughts" intro="Notes on what I'm learning, building, and obsessing over — hobbies included.">
      {thoughts.map(t => (
        <SectionEntry key={t.id}
          meta={t.publishedAt ? format(new Date(t.publishedAt), "MMM yyyy") : undefined}
          title={t.title}
          description={t.bodyMd.replace(/\*\*/g, "").split("\n\n")[0].slice(0, 200)}
          tag={t.topic || undefined}
          thumb={t.imageUrl
            ? <Image src={t.imageUrl} alt="" width={56} height={56} style={{ width: 56, height: 56, borderRadius: 6, objectFit: "cover" }} />
            : undefined}
          href={`/thoughts/${t.slug}`} />
      ))}
    </SectionShell>
  );
}
