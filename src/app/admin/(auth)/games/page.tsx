export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { GamesClient } from "./GamesClient";

export default async function GamesPage() {
  await requireAdmin();
  const games = await db.game.findMany({ orderBy: { order: "asc" } });
  return <GamesClient games={games} />;
}
