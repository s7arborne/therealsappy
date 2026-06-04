"use server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SettingsSchema = z.object({
  name: z.string().min(1),
  logoText: z.string().min(1),
  tagline: z.string().default(""),
  introMd: z.string().default(""),
  githubEnabled: z.boolean().default(false),
  letterboxdEnabled: z.boolean().default(false),
});

const SocialSchema = z.object({
  platform: z.string().min(1),
  label: z.string().min(1),
  url: z.string().min(1),
  handle: z.string().default(""),
  visible: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function updateSettings(data: z.infer<typeof SettingsSchema>) {
  await requireAdmin();
  await db.siteSettings.update({ where: { id: "default" }, data: SettingsSchema.parse(data) });
  revalidatePath("/");
}

export async function createSocial(data: z.infer<typeof SocialSchema>) {
  await requireAdmin();
  await db.social.create({ data: SocialSchema.parse(data) });
  revalidatePath("/");
}

export async function updateSocial(id: string, data: z.infer<typeof SocialSchema>) {
  await requireAdmin();
  await db.social.update({ where: { id }, data: SocialSchema.parse(data) });
  revalidatePath("/");
}

export async function deleteSocial(id: string) {
  await requireAdmin();
  await db.social.delete({ where: { id } });
  revalidatePath("/");
}
