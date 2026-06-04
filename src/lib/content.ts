import { db } from "@/lib/db";

export async function getSiteSettings() {
  return db.siteSettings.findFirst({ where: { id: "default" } });
}

export async function getSocials() {
  return db.social.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
}

export async function getUpdates() {
  return db.update.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
}

export async function getProjects() {
  return db.project.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
}

export async function getGames() {
  return db.game.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
}

export async function getWatched() {
  return db.watched.findMany({ where: { visible: true }, orderBy: { watchedAt: "desc" }, take: 6 });
}

export async function getPublishedThoughts() {
  return db.thought.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
}

export async function getThought(slug: string) {
  return db.thought.findUnique({ where: { slug, published: true } });
}

export async function getLatestThought() {
  return db.thought.findFirst({ where: { published: true }, orderBy: { publishedAt: "desc" } });
}

export async function getCounts() {
  const [updates, projects, games, watched, thoughts] = await Promise.all([
    db.update.count({ where: { visible: true } }),
    db.project.count({ where: { visible: true } }),
    db.game.count({ where: { visible: true } }),
    db.watched.count({ where: { visible: true } }),
    db.thought.count({ where: { published: true } }),
  ]);
  return { updates, projects, games, watched, thoughts };
}
