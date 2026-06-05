import { getGames } from "@/lib/content";
import { SectionShell } from "@/components/public/SectionShell";
import { SectionEntry } from "@/components/public/SectionEntry";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Games" };

export default async function GamesPage() {
  const games = await getGames();
  return (
    <SectionShell title="Games" intro="What I'm playing, replaying, and fully intending to finish someday.">
      {games.map(g => (
        <SectionEntry key={g.id}
          meta={g.status}
          title={`${g.title}${g.rating ? `  ${g.rating}` : ""}`}
          description={`${g.platform}${g.genre ? ` · ${g.genre}` : ""}`}
          thumb={g.coverUrl
            ? <Image src={g.coverUrl} alt="" width={56} height={74} style={{ borderRadius: 6, objectFit: "cover" }} />
            : <span style={{ width: 56, height: 74, borderRadius: 6, display: "grid", placeItems: "center", background: "var(--glass)", border: "1px solid var(--glass-bd)", fontSize: 22 }}>📦</span>} />
      ))}
    </SectionShell>
  );
}
