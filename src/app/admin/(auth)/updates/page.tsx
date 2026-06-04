export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { UpdatesClient } from "./UpdatesClient";

export default async function UpdatesPage() {
  await requireAdmin();
  const updates = await db.update.findMany({ orderBy: { order: "asc" } });
  return <UpdatesClient updates={updates} />;
}
