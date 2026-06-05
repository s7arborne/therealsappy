import type { MetadataRoute } from "next";
import { getPublishedThoughts } from "@/lib/content";

// Always serve fresh — never pre-render at build time (avoids DB calls during build).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3000";

  let thoughts: Awaited<ReturnType<typeof getPublishedThoughts>> = [];
  try {
    thoughts = await getPublishedThoughts();
  } catch {
    // DB not reachable at this point — return base URL only.
  }

  return [
    { url: base, lastModified: new Date() },
    ...thoughts.map(t => ({
      url: `${base}/thoughts/${t.slug}`,
      lastModified: t.updatedAt,
    })),
  ];
}
