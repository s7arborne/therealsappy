import type { MetadataRoute } from "next";

const ADMIN_PATH = process.env.ADMIN_PATH ?? "admin";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: [`/${ADMIN_PATH}/`] },
    ],
    sitemap: `${process.env.SITE_URL ?? "http://localhost:3000"}/sitemap.xml`,
  };
}
