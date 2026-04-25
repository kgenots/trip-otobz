import type { MetadataRoute } from "next";
import { cities } from "@/data/cities";
import { getMergedBlogPosts } from "@/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://trip.otobz.com";
  const blogPosts = await getMergedBlogPosts("ko");
  const blogPostsEnAll = await getMergedBlogPosts("en");
  const enSlugSet = new Set(blogPostsEnAll.map((p) => p.slug));

  const hreflang = {
    ko: `${baseUrl}/`,
    en: `${baseUrl}/en`,
  };

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: { languages: hreflang },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
      alternates: { languages: hreflang },
    },
    ...["about", "privacy", "terms", "contact"].flatMap((p) => [
      {
        url: `${baseUrl}/${p}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.4,
        alternates: {
          languages: {
            ko: `${baseUrl}/${p}`,
            en: `${baseUrl}/en/${p}`,
          },
        },
      },
      {
        url: `${baseUrl}/en/${p}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.4,
        alternates: {
          languages: {
            ko: `${baseUrl}/${p}`,
            en: `${baseUrl}/en/${p}`,
          },
        },
      },
    ]),
    ...cities.flatMap((c) => [
      {
        url: `${baseUrl}/city/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
        alternates: {
          languages: {
            ko: `${baseUrl}/city/${c.slug}`,
            en: `${baseUrl}/en/city/${c.slug}`,
          },
        },
      },
      {
        url: `${baseUrl}/en/city/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
        alternates: {
          languages: {
            ko: `${baseUrl}/city/${c.slug}`,
            en: `${baseUrl}/en/city/${c.slug}`,
          },
        },
      },
    ]),
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          ko: `${baseUrl}/blog`,
          en: `${baseUrl}/en/blog`,
        },
      },
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          ko: `${baseUrl}/blog`,
          en: `${baseUrl}/en/blog`,
        },
      },
    },
    ...blogPosts.map((p) => {
      const hasEn = enSlugSet.has(p.slug);
      return {
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: new Date(p.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        ...(hasEn && {
          alternates: {
            languages: {
              ko: `${baseUrl}/blog/${p.slug}`,
              en: `${baseUrl}/en/blog/${p.slug}`,
            },
          },
        }),
      };
    }),
    ...blogPostsEnAll.map((p) => ({
      url: `${baseUrl}/en/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          ko: `${baseUrl}/blog/${p.slug}`,
          en: `${baseUrl}/en/blog/${p.slug}`,
        },
      },
    })),
  ];
}
