"use server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  iconUrl: z.string().default(""),
  imageUrl: z.string().default(""),
  link: z.string().default(""),
  date: z.string().min(1),
  visible: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function createUpdate(data: z.infer<typeof UpdateSchema>) {
  await requireAdmin();
  const d = UpdateSchema.parse(data);
  await db.update.create({ data: { ...d, date: new Date(d.date) } });
  revalidatePath("/"); revalidatePath("/updates");
}

export async function updateUpdate(id: string, data: z.infer<typeof UpdateSchema>) {
  await requireAdmin();
  const d = UpdateSchema.parse(data);
  await db.update.update({ where: { id }, data: { ...d, date: new Date(d.date) } });
  revalidatePath("/"); revalidatePath("/updates");
}

export async function deleteUpdate(id: string) {
  await requireAdmin();
  await db.update.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleUpdateVisible(id: string, visible: boolean) {
  await requireAdmin();
  await db.update.update({ where: { id }, data: { visible } });
  revalidatePath("/");
}

export async function reorderUpdates(ids: string[]) {
  await requireAdmin();
  await db.$transaction(ids.map((id, i) => db.update.update({ where: { id }, data: { order: i } })));
  revalidatePath("/"); revalidatePath("/updates");
}
