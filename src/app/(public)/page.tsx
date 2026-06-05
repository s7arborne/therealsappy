import { getSiteSettings, getUpdates, getProjects, getGames, getWatched, getPublishedThoughts } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { format } from "date-fns";
import { Greeting } from "@/components/public/Greeting";
import { TipsGrid } from "@/components/public/TipsGrid";
import { SectionHeader } from "@/components/public/SectionHeader";
import { DashCard } from "@/components/public/DashCard";
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
  const [settings, updates, projects, games, watched, thoughts] = await Promise.all([
    getSiteSettings(),
    getUpdates(),
    getProjects(),
    getGames(),
    getWatched(),
    getPublishedThoughts(),
  ]);

  const introHtml = settings?.introMd ? renderMarkdown(settings.introMd) : "";
  const name = settings?.name ?? "Saptarshi Mondal";

  return (
    <>
      <Greeting introHtml={introHtml} />
      <TipsGrid name={name} />

      {/* Updates */}
      <section style={{ marginTop: 72 }}>
        <SectionHeader title="Updates" linkLabel="View All →" linkHref="/updates" />
        <div className="dash-grid">
          {updates.slice(0, 4).map(u => (
            <DashCard key={u.id} href={u.link || "/updates"}
              image={u.imageUrl || undefined}
              icon={u.iconUrl || "🕸️"}
              title={u.title}
              subtitle={u.description}
              meta={format(new Date(u.date), "MMM yyyy")} />
          ))}
        </div>
      </section>

      {/* Projects */}
      <section style={{ marginTop: 72 }}>
        <SectionHeader title="Projects" linkLabel="View All →" linkHref="/projects" />
        <div className="dash-grid">
          {projects.slice(0, 4).map(p => (
            <DashCard key={p.id} href={p.url || "/projects"}
              image={p.imageUrl || undefined}
              icon="🕴️"
              title={p.title}
              subtitle={p.description || undefined}
              meta={p.tag || undefined} />
          ))}
        </div>
      </section>

      {/* Games */}
      <section style={{ marginTop: 72 }}>
        <SectionHeader title="Now Playing" linkLabel="View All →" linkHref="/games" />
        <div className="dash-grid">
          {games.slice(0, 4).map(g => (
            <DashCard key={g.id} href="/games"
              image={g.coverUrl || undefined}
              icon="📦"
              title={g.title}
              subtitle={`${g.platform}${g.genre ? ` · ${g.genre}` : ""}`}
              meta={g.status} />
          ))}
        </div>
      </section>

      {/* Thoughts */}
      <section style={{ marginTop: 72 }}>
        <SectionHeader title="Latest Hobby & Thoughts" linkLabel="View All →" linkHref="/thoughts" />
        <div className="dash-grid">
          {thoughts.slice(0, 4).map(t => (
            <DashCard key={t.id} href={`/thoughts/${t.slug}`}
              image={t.imageUrl || undefined}
              icon="⭐"
              title={t.title}
              subtitle={t.topic || undefined}
              meta={t.publishedAt ? format(new Date(t.publishedAt), "MMM yyyy") : undefined} />
          ))}
        </div>
      </section>

      {/* Watched */}
      <section style={{ marginTop: 72 }}>
        <SectionHeader title="Recently Watched" linkLabel="View All →" linkHref="/watched" />
        <div className="dash-grid">
          {watched.slice(0, 4).map(w => (
            <DashCard key={w.id} href={w.link || "/watched"}
              icon="🎬"
              title={`${w.filmTitle}${w.year ? ` (${w.year})` : ""}`}
              subtitle={[w.rating, w.note].filter(Boolean).join(" — ") || undefined}
              meta={format(new Date(w.watchedAt), "MMM yyyy")} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 70, paddingTop: 24, borderTop: "1px solid var(--line)",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        color: "var(--faint)", fontSize: 11.5 }}>
        <span>© 2026 {name}</span>
        <span>Built in the dark</span>
      </footer>
    </>
  );
}
