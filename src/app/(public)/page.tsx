import { getSiteSettings, getUpdates, getProjects, getGames, getWatched, getLatestThought } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { Greeting } from "@/components/public/Greeting";
import { TipsGrid } from "@/components/public/TipsGrid";
import { SectionHeader } from "@/components/public/SectionHeader";
import { UpdateCard } from "@/components/public/UpdateCard";
import { ProjectList } from "@/components/public/ProjectList";
import { GameCard } from "@/components/public/GameCard";
import { WatchedRow } from "@/components/public/WatchedRow";
import { ThoughtNote } from "@/components/public/ThoughtNote";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: s?.name ?? "Saptarshi Mondal",
    description: s?.tagline ?? "Builder, thinker, perpetual tinkerer.",
  };
}

export default async function HomePage() {
  const [settings, updates, projects, games, watched, latestThought] = await Promise.all([
    getSiteSettings(),
    getUpdates(),
    getProjects(),
    getGames(),
    getWatched(),
    getLatestThought(),
  ]);

  const introHtml = settings?.introMd ? renderMarkdown(settings.introMd) : "";
  const name = settings?.name ?? "Saptarshi Mondal";

  return (
    <>
      <Greeting introHtml={introHtml} />
      <TipsGrid name={name} />

      {/* Updates */}
      <section id="updates" className="rv" style={{ marginTop: 74, scrollMarginTop: 20 }}>
        <SectionHeader title="Updates" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {updates.map(u => <UpdateCard key={u.id} update={u} />)}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="rv" style={{ marginTop: 74, scrollMarginTop: 20 }}>
        <SectionHeader title="Projects" linkLabel="View All →" linkHref="#" />
        <ProjectList projects={projects} />
      </section>

      {/* Games */}
      <section id="games" className="rv" style={{ marginTop: 74, scrollMarginTop: 20 }}>
        <SectionHeader title="Now Playing" linkLabel="Backlog →" linkHref="#" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          {games.map(g => <GameCard key={g.id} game={g} />)}
        </div>
      </section>

      {/* Thoughts */}
      <section id="thoughts" className="rv" style={{ marginTop: 74, scrollMarginTop: 20 }}>
        <SectionHeader title="Latest Hobby & Thoughts" linkLabel="All Writing →" linkHref="/thoughts" />
        {latestThought && <ThoughtNote thought={latestThought} />}
      </section>

      {/* Watched */}
      <section id="watched" className="rv" style={{ marginTop: 74, scrollMarginTop: 20 }}>
        <SectionHeader title="Recently Watched" />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {watched.map(w => <WatchedRow key={w.id} w={w} />)}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 70, paddingTop: 24, borderTop: "1px solid var(--line)",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        color: "var(--faint)", fontSize: 12.5 }}>
        <span>© 2026 {name}</span>
        <span>Built in the dark · <a href="#home" className="footer-top" style={{ transition: "color .2s" }}>Top ↑</a></span>
      </footer>
    </>
  );
}
