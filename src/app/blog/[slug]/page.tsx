import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getMergedBlogPosts, getMergedPostBySlug, getMergedSlugs } from "@/data/blog";
import { cities } from "@/data/cities";
import { blogPostEnBySlug } from "@/data/blog-posts-en";
import SmartCTA from "@/components/SmartCTA";
import BookingBar from "@/components/BookingBar";
import CoupangAffiliateBox from "@/components/CoupangAffiliateBox";
import AdsenseSlot from "@/components/AdsenseSlot";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getMergedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getMergedPostBySlug(slug);
  if (!post) return {};

  const hasEn = !!blogPostEnBySlug[slug];
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${slug}`,
      languages: hasEn
        ? {
            "x-default": `/blog/${slug}`,
            ko: `/blog/${slug}`,
            en: `/en/blog/${slug}`,
          }
        : undefined,
    },
    openGraph: {
      title: `${post.title} | Trip OTOBZ`,
      description: post.description,
      url: `https://trip.otobz.com/blog/${slug}`,
      siteName: "Trip OTOBZ",
      locale: "ko_KR",
      ...(hasEn && { alternateLocale: ["en_US"] }),
      type: "article",
      publishedTime: post.date,
      ...(post.coverImage && {
        images: [{ url: post.coverImage, width: 800, height: 400, alt: post.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-[#222222] mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-[#222222] mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      // 테이블 파싱
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        const row = lines[i].trim().slice(1, -1).split("|").map((c) => c.trim());
        tableRows.push(row);
        i++;
      }
      // 구분선(|--|--|) 행 제거
      const filtered = tableRows.filter((row) => !row.every((c) => /^[-:]+$/.test(c)));
      if (filtered.length > 0) {
        const header = filtered[0];
        const body = filtered.slice(1);
        elements.push(
          <div key={`table-${i}`} className="my-5 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {header.map((cell, ci) => (
                    <th
                      key={ci}
                      className="text-left px-3 py-2 bg-gray-50 text-[#222] font-semibold border-b border-gray-200"
                      dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 1 ? "bg-gray-50/50" : ""}>
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-3 py-2 text-[#444] border-b border-gray-100"
                        dangerouslySetInnerHTML={{ __html: inlineFormat(cell) }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1.5 text-[#444] my-3">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1.5 text-[#444] my-3">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ol>
      );
      continue;
    } else if (/^!\[.*\]\(.+\)$/.test(line.trim())) {
      const match = line.trim().match(/^!\[(.*)?\]\((.+)\)$/);
      if (match) {
        elements.push(
          <figure key={i} className="my-6">
            <img
              src={match[2]}
              alt={match[1] || ""}
              className="w-full h-56 sm:h-72 object-cover rounded-xl"
              loading="lazy"
            />
            {match[1] && (
              <figcaption className="text-xs text-[#999] text-center mt-2">
                {match[1]}
              </figcaption>
            )}
          </figure>
        );
      }
    } else if (line.trim() === "") {
      // skip empty lines
    } else {
      elements.push(
        <p
          key={i}
          className="text-[#444] leading-7 my-3"
          dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
        />
      );
    }
    i++;
  }

  return elements;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-sky-600 hover:text-sky-700 underline">$1</a>'
    );
}

function getRelatedCities(post: {
  slug?: string;
  title: string;
  keywords: string[];
  content: string;
}) {
  const slug = post.slug || "";
  return cities
    .map((c) => {
      let score = 0;
      // slug 매칭 = 글의 주제 도시 (가장 강한 신호)
      if (slug === c.slug) score += 1000;
      else if (slug.includes(`-${c.slug}-`) || slug.startsWith(`${c.slug}-`) || slug.endsWith(`-${c.slug}`)) score += 800;
      // title 매칭 (강한 신호)
      if (post.title.includes(c.cityKo)) score += 100;
      // keywords 매칭
      if (post.keywords.some((k) => k.includes(c.cityKo))) score += 30;
      // 본문 매칭 (약한 신호 — 단순 언급 가능)
      if (post.content.includes(c.cityKo)) {
        const matches = post.content.split(c.cityKo).length - 1;
        score += Math.min(matches, 20);
      }
      return { city: c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.city);
}

function inferStage(post: { title: string; content: string }): "browse" | "plan" | "book" {
  const text = `${post.title} ${post.content.slice(0, 500)}`;
  if (/날씨|유심|환전|공항|택시|심카드|eSIM|와이파이|면세|환율|출입국/.test(text)) return "book";
  if (/3박|4박|일정|코스|경비|예산|plan|itinerary|비교|vs/i.test(text)) return "plan";
  return "browse";
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getMergedPostBySlug(slug);
  if (!post) notFound();

  const adSlotTop = process.env.ADSENSE_SLOT_TOP || "";
  const adSlotMid = process.env.ADSENSE_SLOT_MID || "";
  const adSlotBottom = process.env.ADSENSE_SLOT_BOTTOM || "";

  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "ko",
    wordCount,
    author: {
      "@type": "Organization",
      name: "Trip OTOBZ",
      url: "https://trip.otobz.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Trip OTOBZ",
      url: "https://trip.otobz.com",
      logo: {
        "@type": "ImageObject",
        url: "https://trip.otobz.com/icon",
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: `https://trip.otobz.com/blog/${slug}`,
    keywords: post.keywords.join(", "),
    ...(post.coverImage && { image: post.coverImage }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trip OTOBZ", item: "https://trip.otobz.com/" },
      { "@type": "ListItem", position: 2, name: "블로그", item: "https://trip.otobz.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://trip.otobz.com/blog/${slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <header className="border-b border-gray-100 px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="text-base sm:text-xl font-bold text-[#222222] tracking-tight hover:text-sky-600 transition-colors"
          >
            Trip<span className="hidden sm:inline"> OTOBZ</span>
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href="/blog"
            className="text-sm font-medium text-[#6a6a6a] hover:text-sky-600 transition-colors"
          >
            블로그
          </Link>
        </div>
      </header>

      {post.coverImage ? (
        <div className="h-64 sm:h-80 bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }} />
      ) : (
        <div className={`h-64 sm:h-80 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}>
          <span className="text-8xl sm:text-9xl">{post.coverEmoji}</span>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <time className="text-sm text-[#6a6a6a]">{post.date}</time>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] mt-2 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* 상단 광고 슬롯 (in-feed 형식) */}
        {adSlotTop && (
          <div className="my-6 min-h-[100px]">
            <AdsenseSlot slot={adSlotTop} format="auto" />
          </div>
        )}

        {/* 상단 CTA — intent-aware. plan/book 단계면 바로 예약 바 */}
        {(() => {
          const rc = getRelatedCities(post);
          const stage = inferStage(post);
          if (rc.length === 0 || stage === "browse") return null;
          const primary = rc[0];
          return (
            <div className="mb-8">
              <BookingBar
                cityEn={primary.cityEn}
                cityKo={primary.cityKo}
                stage={stage}
                placement={`blog-top-${stage}`}
                lang="ko"
                products={stage === "book" ? ["hotel", "flight"] : ["hotel", "tour", "flight"]}
              />
            </div>
          );
        })()}

        <div className="prose-custom">{renderMarkdown(post.content)}</div>

        {/* 본문 직후 광고 슬롯 (in-article 형식 권장) */}
        {adSlotMid && (
          <div className="my-8 min-h-[120px]">
            <AdsenseSlot
              slot={adSlotMid}
              format="fluid"
              layout="in-article"
            />
          </div>
        )}

        {/* 쿠팡 어필리에이트 박스 — 여행 준비 필수템 */}
        {(() => {
          const rc = getRelatedCities(post);
          const primary = rc[0];
          return (
            <CoupangAffiliateBox
              cityKo={primary?.cityKo}
              countryKo={primary?.countryKo}
            />
          );
        })()}

        {/* 본문 하단 CTA — 호텔 집중 (primary city 기준) */}
        {(() => {
          const rc = getRelatedCities(post);
          if (rc.length === 0) return null;
          const primary = rc[0];
          const stage = inferStage(post);
          return (
            <div className="mt-10">
              <SmartCTA
                cityEn={primary.cityEn}
                cityKo={primary.cityKo}
                product="hotel"
                stage={stage}
                placement="blog-bottom-hotel"
                lang="ko"
                limit={3}
              />
            </div>
          );
        })()}

        {/* 관련 도시 CTA */}
        {(() => {
          const relatedCities = getRelatedCities(post);
          if (relatedCities.length === 0) return null;
          return (
            <div className="mt-10 p-6 bg-sky-50 rounded-2xl">
              <h3 className="font-bold text-[#222222] mb-3">
                관련 도시 액티비티 둘러보기
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedCities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/city/${c.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-xl text-sm font-medium text-[#222222] border border-sky-100 hover:border-sky-300 hover:shadow-sm transition-all"
                  >
                    <span>{c.emoji}</span>
                    <span>{c.cityKo} 액티비티</span>
                    <span className="text-sky-500">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        {/* 하단 광고 슬롯 (multiplex/auto 형식) */}
        {adSlotBottom && (
          <div className="mt-10 min-h-[200px]">
            <AdsenseSlot slot={adSlotBottom} format="auto" />
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link
            href="/blog"
            className="text-sm text-sky-600 hover:text-sky-700 font-medium"
          >
            &larr; 블로그 목록으로
          </Link>
        </div>
      </article>
    </main>
  );
}
