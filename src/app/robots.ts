import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      "https://trip.otobz.com/sitemap.xml",
      "https://otobz.com/sitemap.xml",
    ],
  };
}
