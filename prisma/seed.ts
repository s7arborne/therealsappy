import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const filename = dbUrl.replace(/^file:/, "");
const resolved = path.isAbsolute(filename) ? filename : path.resolve(process.cwd(), filename);
const adapter = new PrismaBetterSqlite3({ url: resolved });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Saptarshi Mondal",
      logoText: "Saptarshi",
      tagline: "Builder, thinker, perpetual tinkerer.",
      introMd: "My name is **Saptarshi Mondal** — welcome to my corner of the internet.",
      githubEnabled: false,
      letterboxdEnabled: false,
    },
  });

  const socials = [
    { platform: "email", label: "Email", url: "mailto:hi@example.com", handle: "hi@example.com", order: 0 },
    { platform: "twitter", label: "Twitter / X", url: "https://twitter.com/therealsappy", handle: "therealsappy", order: 1 },
    { platform: "instagram", label: "Instagram", url: "https://instagram.com/therealsappy", handle: "therealsappy", order: 2 },
    { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/saptarshi", handle: "saptarshi", order: 3 },
    { platform: "github", label: "GitHub", url: "https://github.com/therealsappy", handle: "therealsappy", order: 4 },
    { platform: "letterboxd", label: "Letterboxd", url: "https://letterboxd.com/therealsappy", handle: "therealsappy", order: 5 },
  ];
  for (const s of socials) await prisma.social.create({ data: s });

  const updates = [
    { title: "Started a new role", description: "Joined an exciting team working on developer tooling.", iconUrl: "◆", date: new Date("2026-06-01"), order: 0 },
    { title: "Shipped a side project", description: "Launched a small tool that scratched my own itch.", iconUrl: "✦", date: new Date("2026-04-15"), order: 1 },
    { title: "Conference talk", description: "Gave a talk at a local meetup about building in public.", iconUrl: "●", date: new Date("2026-02-20"), order: 2 },
    { title: "Year milestone", description: "Hit a personal goal I'd been working toward for 18 months.", iconUrl: "▲", date: new Date("2026-01-10"), order: 3 },
  ];
  for (const u of updates) await prisma.update.create({ data: u });

  const projects = [
    { title: "thissite", tag: "Web", url: "https://github.com/therealsappy/mysite", description: "This very site — Next.js, Tailwind, Prisma.", order: 0 },
    { title: "devtool", tag: "App", url: "#", description: "A developer productivity tool.", order: 1 },
    { title: "designsystem", tag: "Design", url: "#", description: "A minimal design system experiment.", order: 2 },
    { title: "openlib", tag: "Open Source", url: "#", description: "Small open-source utility library.", order: 3 },
  ];
  for (const p of projects) await prisma.project.create({ data: p });

  const games = [
    { title: "Hollow Knight", platform: "PC", genre: "Metroidvania", status: "Now Playing", coverUrl: "", order: 0 },
    { title: "Hades", platform: "PC", genre: "Roguelite", status: "Completed", coverUrl: "", order: 1 },
    { title: "Celeste", platform: "PC", genre: "Platformer", status: "100%'d", coverUrl: "", order: 2 },
    { title: "Elden Ring", platform: "PC", genre: "Action RPG", status: "On Deck", coverUrl: "", order: 3 },
  ];
  for (const g of games) await prisma.game.create({ data: g });

  await prisma.watched.createMany({
    data: [
      { filmTitle: "Dune: Part Two", year: "2024", rating: "★★★★½", note: "Breathtaking scale.", watchedAt: new Date("2026-05-28") },
      { filmTitle: "The Substance", year: "2024", rating: "★★★★", note: "Visceral, funny, uncomfortable.", watchedAt: new Date("2026-05-15") },
    ],
  });

  await prisma.thought.create({
    data: {
      slug: "on-building-in-public",
      title: "On Building in Public",
      topic: "Craft",
      bodyMd: `I've been thinking a lot about **building in public** lately.\n\nThere's something freeing about committing to show your work — messy, incomplete, wrong sometimes. It removes the pressure of the grand reveal.\n\nWhat surprised me most was how much *I* learned from writing things down. The act of articulating a decision, even to nobody, sharpens it.\n\nI'm going to try to write more here. Short, honest, not-perfectly-edited notes. Welcome to the experiment.`,
      isNew: true,
      published: true,
      publishedAt: new Date("2026-06-01"),
    },
  });

  console.log("✓ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
