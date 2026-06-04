import type { MetadataRoute } from "next";
import { getPublishedThoughts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  const thoughts = await getPublishedThoughts();
  return [
    { url: base, lastModified: new Date() },
    ...thoughts.map(t => ({
      url: `${base}/thoughts/${t.slug}`,
      lastModified: t.updatedAt,
    })),
  ];
}
