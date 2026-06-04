"use server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ThoughtSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  topic: z.string().default(""),
  bodyMd: z.string().min(1),
  isNew: z.boolean().default(false),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
});

export async function createThought(data: z.infer<typeof ThoughtSchema>) {
  await requireAdmin();
  const d = ThoughtSchema.parse(data);
  await db.thought.create({
    data: { ...d, publishedAt: d.publishedAt ? new Date(d.publishedAt) : null },
  });
  revalidatePath("/"); revalidatePath("/thoughts");
}

export async function updateThought(id: string, data: z.infer<typeof ThoughtSchema>) {
  await requireAdmin();
  const d = ThoughtSchema.parse(data);
  await db.thought.update({
    where: { id },
    data: { ...d, publishedAt: d.publishedAt ? new Date(d.publishedAt) : null },
  });
  revalidatePath("/"); revalidatePath("/thoughts");
}

export async function deleteThought(id: string) {
  await requireAdmin();
  await db.thought.delete({ where: { id } });
  revalidatePath("/"); revalidatePath("/thoughts");
}
