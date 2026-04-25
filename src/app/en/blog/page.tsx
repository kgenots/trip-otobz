import type { Metadata } from "next";
import Link from "next/link";
import { getMergedBlogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Travel Blog",
  description:
    "Smart travel guides: flight deal timing, city tips, hotel and tour recommendations across Tokyo, Bangkok, Paris, and more — from Trip OTOBZ.",
  alternates: {
    canonical: "/en/blog",
    languages: {
      "x-default": "/blog",
      ko: "/blog",
      en: "/en/blog",
    },
  },
  openGraph: {
    title: "Travel Blog | Trip OTOBZ",
    description:
      "Smart travel guides across the world's top cities.",
    url: "https://trip.otobz.com/en/blog",
    siteName: "Trip OTOBZ",
    locale: "en_US",
    alternateLocale: ["ko_KR"],
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogListPageEn() {
  const posts = await getMergedBlogPosts("en");

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/en"
            className="text-base sm:text-xl font-bold text-[#222222] tracking-tight hover:text-sky-600 transition-colors"
          >
            Trip<span className="hidden sm:inline"> OTOBZ</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">Blog</span>
          <span className="ml-auto">
            <Link
              href="/blog"
              className="text-xs text-[#888] hover:text-sky-600"
              hrefLang="ko"
            >
              한국어
            </Link>
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-2">
          Travel Blog
        </h1>
        <p className="text-[#6a6a6a] mb-10">
          Deal timing, city guides, and honest travel tips.
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/en/blog/${post.slug}`}
              className="block rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all overflow-hidden"
            >
              {post.coverImage ? (
                <div
                  className="h-48 sm:h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.coverImage})` }}
                />
              ) : (
                <div
                  className={`h-48 sm:h-56 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}
                >
                  <span className="text-7xl">{post.coverEmoji}</span>
                </div>
              )}
              <div className="p-5">
                <time className="text-xs text-[#6a6a6a]">{post.date}</time>
                <h2 className="text-lg font-semibold text-[#222222] mt-1 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-[#6a6a6a] line-clamp-2">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
