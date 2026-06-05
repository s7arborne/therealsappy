import { getWatched } from "@/lib/content";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionEntry } from "@/components/public/SectionEntry";
import { format } from "date-fns";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Watched" };

export default async function WatchedPage() {
  const watched = await getWatched();
  return (
    <SectionShell title="Watched" intro="Films and shows I've been watching lately — usually at hours I shouldn't be awake.">
      {watched.map(w => (
        <SectionEntry key={w.id}
          meta={format(new Date(w.watchedAt), "MMM yyyy")}
          title={`${w.filmTitle}${w.year ? ` (${w.year})` : ""}`}
          description={[w.rating, w.note].filter(Boolean).join(" — ") || undefined}
          href={w.link || undefined} />
      ))}
    </SectionShell>
  );
}
