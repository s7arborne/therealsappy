"use server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProjectSchema = z.object({
  title: z.string().min(1),
  tag: z.string().default(""),
  url: z.string().default(""),
  description: z.string().default(""),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function createProject(data: z.infer<typeof ProjectSchema>) {
  await requireAdmin();
  await db.project.create({ data: ProjectSchema.parse(data) });
  revalidatePath("/");
}

export async function updateProject(id: string, data: z.infer<typeof ProjectSchema>) {
  await requireAdmin();
  await db.project.update({ where: { id }, data: ProjectSchema.parse(data) });
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await db.project.delete({ where: { id } });
  revalidatePath("/");
}

export async function toggleProjectVisible(id: string, visible: boolean) {
  await requireAdmin();
  await db.project.update({ where: { id }, data: { visible } });
  revalidatePath("/");
}
