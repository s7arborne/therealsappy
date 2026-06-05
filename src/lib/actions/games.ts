"use server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const GameSchema = z.object({
  title: z.string().min(1),
  platform: z.string().default(""),
  genre: z.string().default(""),
  status: z.string().default("Now Playing"),
  coverUrl: z.string().default(""),
  rating: z.string().default(""),
  visible: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function createGame(data: z.infer<typeof GameSchema>) {
  await requireAdmin();
  await db.game.create({ data: GameSchema.parse(data) });
  revalidatePath("/");
}

export async function updateGame(id: string, data: z.infer<typeof GameSchema>) {
  await requireAdmin();
  await db.game.update({ where: { id }, data: GameSchema.parse(data) });
  revalidatePath("/");
}

export async function deleteGame(id: string) {
  await requireAdmin();
  await db.game.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleGameVisible(id: string, visible: boolean) {
  await requireAdmin();
  await db.game.update({ where: { id }, data: { visible } });
  revalidatePath("/");
}

export async function reorderGames(ids: string[]) {
  await requireAdmin();
  await db.$transaction(ids.map((id, i) => db.game.update({ where: { id }, data: { order: i } })));
  revalidatePath("/");
}
