export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  await requireAdmin();
  const [settings, socials] = await Promise.all([
    db.siteSettings.findFirst({ where: { id: "default" } }),
    db.social.findMany({ orderBy: { order: "asc" } }),
  ]);
  return <SettingsClient settings={settings} socials={socials} />;
}
