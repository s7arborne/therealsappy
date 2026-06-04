import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  // Clear content so seed is safe to re-run
  await db.thought.deleteMany();
  await db.watched.deleteMany();
  await db.game.deleteMany();
  await db.project.deleteMany();
  await db.update.deleteMany();
  await db.social.deleteMany();

  await db.siteSettings.upsert({
    where: { id: "default" },
    update: {
      name: "Saptarshi Mondal",
      logoText: "Sappy",
      tagline: "Builder, thinker, perpetual tinkerer.",
      introMd:
        "My name is **Saptarshi Mondal** — welcome to my corner of the internet.",
      githubEnabled: true,
      letterboxdEnabled: true,
    },
    create: {
      id: "default",
      name: "Saptarshi Mondal",
      logoText: "Sappy",
      tagline: "Builder, thinker, perpetual tinkerer.",
      introMd:
        "My name is **Saptarshi Mondal** — welcome to my corner of the internet. I build software, play too many games, and write notes when something sticks.",
      githubEnabled: true,
      letterboxdEnabled: true,
    },
  });

  await db.social.createMany({
    data: [
      { platform: "email", label: "Email", url: "mailto:hi@therealsappy.com", handle: "hi@therealsappy.com", order: 0 },
      { platform: "twitter", label: "Twitter / X", url: "https://twitter.com/therealsappy", handle: "therealsappy", order: 1 },
      { platform: "instagram", label: "Instagram", url: "https://instagram.com/therealsappy", handle: "therealsappy", order: 2 },
      { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/saptarshi", handle: "saptarshi", order: 3 },
      { platform: "github", label: "GitHub", url: "https://github.com/therealsappy", handle: "therealsappy", order: 4 },
      { platform: "letterboxd", label: "Letterboxd", url: "https://letterboxd.com/therealsappy", handle: "therealsappy", order: 5 },
    ],
  });

  await db.update.createMany({
    data: [
      { title: "Launched this site", description: "Shipped v1 of my personal site — Next.js, Prisma, SQLite.", iconUrl: "◆", link: "#projects", date: new Date("2026-06-01"), order: 0 },
      { title: "Started a new role", description: "Joined a team building developer tooling I'm genuinely excited about.", iconUrl: "✦", date: new Date("2026-04-15"), order: 1 },
      { title: "Conference talk", description: "Spoke at a local meetup on building in public and learning in the open.", iconUrl: "●", link: "#thoughts", date: new Date("2026-02-20"), order: 2 },
      { title: "Year milestone", description: "Hit a personal goal I'd been chipping away at for 18 months.", iconUrl: "▲", date: new Date("2026-01-10"), order: 3 },
    ],
  });

  await db.project.createMany({
    data: [
      { title: "therealsappy", tag: "Web", url: "https://github.com/therealsappy/therealsappy", description: "This site — Next.js, Tailwind, Prisma, admin CMS.", featured: true, order: 0 },
      { title: "clipstash", tag: "App", url: "https://github.com/therealsappy/clipstash", description: "Save and search code snippets from anywhere.", order: 1 },
      { title: "aurora-ui", tag: "Design", url: "#", description: "Experiment with animated gradients and glass panels.", order: 2 },
      { title: "tinyfetch", tag: "Open Source", url: "#", description: "Minimal fetch wrapper with retries and typed errors.", order: 3 },
    ],
  });

  await db.game.createMany({
    data: [
      { title: "Hollow Knight: Silksong", platform: "Switch", genre: "Metroidvania", status: "Now Playing", rating: "★★★★★", order: 0 },
      { title: "Hades II", platform: "PC", genre: "Roguelite", status: "Now Playing", order: 1 },
      { title: "Celeste", platform: "PC", genre: "Platformer", status: "100%'d", rating: "★★★★★", order: 2 },
      { title: "Elden Ring", platform: "PC", genre: "Action RPG", status: "On Deck", order: 3 },
    ],
  });

  await db.watched.createMany({
    data: [
      { filmTitle: "Sinners", year: "2025", rating: "★★★★★", note: "Stunning. Coogler at full power.", watchedAt: new Date("2026-05-28") },
      { filmTitle: "Dune: Part Two", year: "2024", rating: "★★★★½", note: "Breathtaking scale.", link: "https://letterboxd.com/film/dune-part-two/", watchedAt: new Date("2026-05-10") },
      { filmTitle: "The Substance", year: "2024", rating: "★★★★", note: "Visceral, funny, uncomfortable.", watchedAt: new Date("2026-04-22") },
      { filmTitle: "Past Lives", year: "2023", rating: "★★★★★", note: "Quiet and devastating.", watchedAt: new Date("2026-03-15") },
    ],
  });

  await db.thought.createMany({
    data: [
      {
        slug: "on-building-in-public",
        title: "On Building in Public",
        topic: "Craft",
        bodyMd: `I've been thinking a lot about **building in public** lately.

There's something freeing about committing to show your work — messy, incomplete, wrong sometimes. It removes the pressure of the grand reveal.

What surprised me most was how much *I* learned from writing things down. The act of articulating a decision, even to nobody, sharpens it.

I'm going to try to write more here. Short, honest, not-perfectly-edited notes. Welcome to the experiment.`,
        isNew: true,
        published: true,
        publishedAt: new Date("2026-06-01"),
      },
      {
        slug: "why-side-projects",
        title: "Why I Still Make Side Projects",
        topic: "Building",
        bodyMd: `Side projects aren't about shipping the next unicorn. They're **permission to play** — try a stack, break things, follow curiosity without a roadmap.

The best ones teach you something your day job won't: how to name things, when to stop, how it feels to maintain your own mess.

This site is one of those. Small scope, real constraints, no deadline except the one I set.`,
        isNew: false,
        published: true,
        publishedAt: new Date("2026-04-08"),
      },
    ],
  });

  console.log("✓ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
