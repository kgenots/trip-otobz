import Link from "next/link";
import { cities } from "@/data/cities";
import { getMergedBlogPosts } from "@/data/blog";
import HeroClient from "@/components/HeroClient";
import CuratorWidget from "@/components/CuratorWidget";
import { computeHeroSummary } from "@/lib/hero-summary";

function fmtKrw(n: number) {
  return "₩" + n.toLocaleString("ko-KR");
}

const POPULAR_SLUGS = [
  "tokyo", "osaka", "bangkok", "danang", "cebu",
  "singapore", "bali", "paris", "london", "newyork",
  "hawaii", "guam", "taipei", "hongkong",
];

const regionGroups = [
  { label: "일본", slugs: ["tokyo", "osaka", "kyoto", "fukuoka", "sapporo", "okinawa", "nagoya"] },
  { label: "동남아", slugs: ["bangkok", "chiangmai", "phuket", "hochiminh", "hanoi", "danang", "singapore", "bali", "cebu", "manila", "kualalumpur", "kotakinabalu", "siemreap"] },
  { label: "중화권", slugs: ["taipei", "hongkong", "macau", "shanghai", "beijing"] },
  { label: "중동·남아시아", slugs: ["dubai", "istanbul", "maldives"] },
  { label: "유럽", slugs: ["paris", "london", "barcelona", "rome", "amsterdam", "prague", "vienna", "zurich", "lisbon", "athens", "helsinki"] },
  { label: "미주", slugs: ["newyork", "losangeles", "sanfrancisco", "lasvegas", "hawaii", "cancun"] },
  { label: "태평양·오세아니아", slugs: ["guam", "saipan", "sydney", "melbourne", "auckland"] },
  { label: "아프리카", slugs: ["cairo"] },
];

const cityBySlug = Object.fromEntries(cities.map((c) => [c.slug, c]));

export const dynamic = "force-dynamic";

export default async function Home() {
  const [blogPosts, summary] = await Promise.all([
    getMergedBlogPosts(),
    computeHeroSummary(),
  ]);
  const recentPosts = blogPosts.slice(0, 3);
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-lg sm:text-xl font-bold text-[#222222] tracking-tight">
            Trip OTOBZ
          </h1>
          <nav className="flex items-center gap-4">
            <a
              href="#explore"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              도시 탐색
            </a>
            <Link
              href="/new/price"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              Price Pulse
            </Link>
            <Link
              href="/blog"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              블로그
            </Link>
            <Link
              href="/en"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
              hrefLang="en"
            >
              EN
            </Link>
          </nav>
        </div>
      </header>

      {/* 히어로 (클라이언트) */}
      <HeroClient />

      {/* AI 큐레이터 위젯 */}
      <CuratorWidget />

      {/* 인기 여행지 카드 */}
      <section id="explore" className="bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="mb-10">
            <h3 className="text-lg font-bold text-[#222222] mb-5">인기 여행지</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {POPULAR_SLUGS.map((slug) => {
                const c = cityBySlug[slug];
                if (!c) return null;
                const deal = summary.bySlug[slug];
                const isHot = deal?.dropPct !== null && deal?.dropPct !== undefined && deal.dropPct <= -15;
                return (
                  <Link
                    key={slug}
                    href={`/city/${slug}`}
                    className="relative bg-white rounded-xl px-4 py-4 text-center border border-gray-100 hover:border-sky-300 hover:shadow-sm transition-all group"
                  >
                    {isHot && (
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-bold text-white bg-orange-500 rounded-full px-1.5 py-0.5">
                        🔥
                      </span>
                    )}
                    <div className="text-2xl mb-1">{c.emoji}</div>
                    <div className="text-base font-semibold text-[#222222] group-hover:text-sky-600 transition-colors">
                      {c.cityKo}
                    </div>
                    <div className="text-xs text-[#6a6a6a] mt-0.5">{c.countryKo}</div>
                    {deal ? (
                      <div className="mt-2 text-[11px] font-semibold text-rose-500">
                        {fmtKrw(deal.minPrice)}~
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-[#bbb]">가격 업데이트 예정</div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 지역별 도시 */}
          <div className="space-y-6">
            {regionGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-base font-bold text-[#222222] mb-3">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.slugs.map((slug) => {
                    const c = cityBySlug[slug];
                    if (!c) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/city/${slug}`}
                        className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 text-[#6a6a6a] hover:border-sky-300 hover:text-sky-600 transition-all"
                      >
                        {c.emoji} {c.cityKo}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최근 블로그 */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#222222]">여행 블로그</h3>
            <Link href="/blog" className="text-sm text-sky-500 hover:text-sky-600 font-medium">
              전체 보기 &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-xl border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all overflow-hidden group"
              >
                {post.coverImage ? (
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.coverImage})` }}
                  />
                ) : (
                  <div
                    className={`h-40 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}
                  >
                    <span className="text-5xl">{post.coverEmoji}</span>
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-sm text-[#222222] group-hover:text-sky-600 transition-colors line-clamp-2 mb-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-[#6a6a6a] line-clamp-2">{post.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-[#FAFAFA] border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#222222]">Trip OTOBZ</p>
              <p className="text-xs text-[#6a6a6a] mt-1">
                여행지에서 뭐하지? 전 세계 도시의 베스트 액티비티를 비교하세요.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-xs text-[#6a6a6a] hover:text-sky-500">
                블로그
              </Link>
              <Link href="/sitemap.xml" className="text-xs text-[#6a6a6a] hover:text-sky-500">
                사이트맵
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-[11px] text-[#999]">
              이 사이트는 마이리얼트립, Klook, Agoda 등의 제휴 링크를 포함하고 있으며, 링크를 통한 구매 시 사이트 운영자에게 수수료가 지급될 수 있습니다. 이용자에게 추가 비용은 발생하지 않습니다.
            </p>
            <p className="text-[11px] text-[#999] mt-1">
              &copy; {new Date().getFullYear()} Trip OTOBZ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
