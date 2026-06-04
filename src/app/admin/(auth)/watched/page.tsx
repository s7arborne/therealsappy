export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { WatchedClient } from "./WatchedClient";

export default async function WatchedPage() {
  await requireAdmin();
  const watched = await db.watched.findMany({ orderBy: { watchedAt: "desc" } });
  return <WatchedClient watched={watched} />;
}
