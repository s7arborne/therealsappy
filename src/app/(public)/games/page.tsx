import { getGames } from "@/lib/content";
import { GameCard } from "@/components/public/GameCard";
import { PageHeader } from "@/components/public/PageHeader";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Games" };

export default async function GamesPage() {
  const games = await getGames();
  return (
    <>
      <PageHeader title="Games" intro="What I'm playing, replaying, and fully intending to finish someday." />
      <div className="games-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {games.map(g => <GameCard key={g.id} game={g} />)}
      </div>
    </>
  );
}
