import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "여행 블로그",
  description:
    "항공권 최저가 타이밍, 여행지별 꿀팁, 숙소·투어 추천까지. Trip OTOBZ 여행 블로그에서 스마트한 여행을 준비하세요.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "여행 블로그 | Trip OTOBZ",
    description:
      "항공권 최저가 타이밍, 여행지별 꿀팁, 숙소·투어 추천까지.",
    url: "https://trip.otobz.com/blog",
    siteName: "Trip OTOBZ",
    locale: "ko_KR",
    type: "website",
  },
};

export default function BlogListPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="text-base sm:text-xl font-bold text-[#222222] tracking-tight hover:text-sky-600 transition-colors"
          >
            Trip<span className="hidden sm:inline"> OTOBZ</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">블로그</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-2">
          여행 블로그
        </h1>
        <p className="text-[#6a6a6a] mb-10">
          항공권 최저가 타이밍, 여행지별 꿀팁, 숙소·투어 추천까지.
        </p>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all overflow-hidden"
            >
              {post.coverImage ? (
                <div className="h-48 sm:h-56 bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }} />
              ) : (
                <div className={`h-48 sm:h-56 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}>
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
