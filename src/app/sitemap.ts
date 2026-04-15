import type { MetadataRoute } from "next";
import { cities } from "@/data/cities";
import { destinations } from "@/data/destinations";
import { blogPosts } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://trip.otobz.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...cities.map((c) => ({
      url: `${baseUrl}/city/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...destinations.map((d) => ({
      url: `${baseUrl}/destinations/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
