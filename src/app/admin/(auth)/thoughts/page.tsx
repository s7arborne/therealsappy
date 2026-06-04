export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ThoughtsClient } from "./ThoughtsClient";

export default async function ThoughtsPage() {
  await requireAdmin();
  const thoughts = await db.thought.findMany({ orderBy: { createdAt: "desc" } });
  return <ThoughtsClient thoughts={thoughts} />;
}
