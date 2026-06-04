"use server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const WatchedSchema = z.object({
  filmTitle: z.string().min(1),
  year: z.string().default(""),
  rating: z.string().default(""),
  note: z.string().default(""),
  link: z.string().default(""),
  watchedAt: z.string().min(1),
  visible: z.boolean().default(true),
});

export async function createWatched(data: z.infer<typeof WatchedSchema>) {
  await requireAdmin();
  const d = WatchedSchema.parse(data);
  await db.watched.create({ data: { ...d, watchedAt: new Date(d.watchedAt) } });
  revalidatePath("/");
}

export async function updateWatched(id: string, data: z.infer<typeof WatchedSchema>) {
  await requireAdmin();
  const d = WatchedSchema.parse(data);
  await db.watched.update({ where: { id }, data: { ...d, watchedAt: new Date(d.watchedAt) } });
  revalidatePath("/");
}

export async function deleteWatched(id: string) {
  await requireAdmin();
  await db.watched.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleWatchedVisible(id: string, visible: boolean) {
  await requireAdmin();
  await db.watched.update({ where: { id }, data: { visible } });
  revalidatePath("/");
}
