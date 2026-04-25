import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { blogPostEnBySlug, blogPostsEn } from "@/data/blog-posts-en";
import { cities } from "@/data/cities";
import { renderMarkdown } from "@/lib/markdown";
import SmartCTA from "@/components/SmartCTA";
import BookingBar from "@/components/BookingBar";
import AdsenseSlot from "@/components/AdsenseSlot";
import TravelInsuranceBox from "@/components/TravelInsuranceBox";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPostsEn.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostEnBySlug[slug];
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/en/blog/${slug}`,
      languages: {
        "x-default": `/blog/${slug}`,
        ko: `/blog/${slug}`,
        en: `/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: `${post.title} | Trip OTOBZ`,
      description: post.description,
      url: `https://trip.otobz.com/en/blog/${slug}`,
      siteName: "Trip OTOBZ",
      locale: "en_US",
      alternateLocale: ["ko_KR"],
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

function getRelatedCities(post: { title: string; keywords: string[]; content: string }) {
  const text = `${post.title} ${post.keywords.join(" ")} ${post.content}`.toLowerCase();
  return cities
    .filter((c) => text.includes(c.cityEn.toLowerCase()))
    .slice(0, 4);
}

function inferStage(post: { title: string; content: string }): "browse" | "plan" | "book" {
  const text = `${post.title} ${post.content.slice(0, 500)}`;
  if (/weather|airport|esim|sim|wifi|packing|transport|visa|currency|atm|taxi/i.test(text)) return "book";
  if (/itinerary|3 days|4 days|budget|guide|compare|vs|days? guide/i.test(text)) return "plan";
  return "browse";
}

const adSlotTopEn = process.env.ADSENSE_SLOT_TOP || "";
const adSlotMidEn = process.env.ADSENSE_SLOT_MID || "";
const adSlotBottomEn = process.env.ADSENSE_SLOT_BOTTOM || "";

export default async function BlogPostPageEn({ params }: Props) {
  const { slug } = await params;
  const post = blogPostEnBySlug[slug];
  if (!post) notFound();

  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    wordCount,
    author: {
      "@type": "Organization",
      name: "Trip OTOBZ",
      url: "https://trip.otobz.com/en/about",
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
    mainEntityOfPage: `https://trip.otobz.com/en/blog/${slug}`,
    keywords: post.keywords.join(", "),
    ...(post.coverImage && { image: post.coverImage }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trip OTOBZ", item: "https://trip.otobz.com/en" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://trip.otobz.com/en/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://trip.otobz.com/en/blog/${slug}` },
    ],
  };

  const rc = getRelatedCities(post);
  const stage = inferStage(post);
  const primary = rc[0];

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
            href="/en"
            className="text-base sm:text-xl font-bold text-[#222222] tracking-tight hover:text-sky-600 transition-colors"
          >
            Trip<span className="hidden sm:inline"> OTOBZ</span>
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href="/en/blog"
            className="text-sm font-medium text-[#6a6a6a] hover:text-sky-600 transition-colors"
          >
            Blog
          </Link>
          <span className="ml-auto">
            <Link
              href={`/blog/${slug}`}
              className="text-xs text-[#888] hover:text-sky-600"
              hrefLang="ko"
            >
              한국어
            </Link>
          </span>
        </div>
      </header>

      {post.coverImage ? (
        <div
          className="h-64 sm:h-80 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.coverImage})` }}
        />
      ) : (
        <div
          className={`h-64 sm:h-80 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}
        >
          <span className="text-8xl sm:text-9xl">{post.coverEmoji}</span>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <time className="text-sm text-[#6a6a6a]">{post.date}</time>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] mt-2 mb-6 leading-tight">
          {post.title}
        </h1>

        {adSlotTopEn && (
          <div className="my-6 min-h-[100px]">
            <AdsenseSlot slot={adSlotTopEn} format="auto" />
          </div>
        )}

        {primary && stage !== "browse" && (
          <div className="mb-8">
            <BookingBar
              cityEn={primary.cityEn}
              cityKo={primary.cityKo}
              stage={stage}
              placement={`blog-en-top-${stage}`}
              lang="en"
              products={stage === "book" ? ["hotel", "flight"] : ["hotel", "tour", "flight"]}
            />
          </div>
        )}

        <div className="prose-custom">{renderMarkdown(post.content)}</div>

        {adSlotMidEn && (
          <div className="my-8 min-h-[120px]">
            <AdsenseSlot
              slot={adSlotMidEn}
              format="fluid"
              layout="in-article"
            />
          </div>
        )}

        {primary && (
          <div className="mt-10">
            <SmartCTA
              cityEn={primary.cityEn}
              cityKo={primary.cityKo}
              product="hotel"
              stage={stage}
              placement="blog-en-bottom-hotel"
              lang="en"
              limit={3}
            />
          </div>
        )}

        {primary && (
          <TravelInsuranceBox
            cityKo={primary.cityKo}
            cityEn={primary.cityEn}
            countryKo={primary.countryKo}
            lang="en"
          />
        )}

        {adSlotBottomEn && (
          <div className="mt-10 min-h-[200px]">
            <AdsenseSlot slot={adSlotBottomEn} format="auto" />
          </div>
        )}

        {rc.length > 0 && (
          <div className="mt-10 p-6 bg-sky-50 rounded-2xl">
            <h3 className="font-bold text-[#222222] mb-3">Explore related destinations</h3>
            <div className="flex flex-wrap gap-2">
              {rc.map((c) => (
                <Link
                  key={c.slug}
                  href={`/city/${c.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-xl text-sm font-medium text-[#222222] border border-sky-100 hover:border-sky-300 hover:shadow-sm transition-all"
                >
                  <span>{c.emoji}</span>
                  <span>{c.cityEn}</span>
                  <span className="text-sky-500">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
