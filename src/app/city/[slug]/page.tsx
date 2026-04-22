import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cities, cityBySlug } from "@/data/cities";
import { getMergedBlogPosts } from "@/data/blog";
import CityClient from "./CityClient";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = cityBySlug[slug];
  if (!city) return {};

  const title = `${city.cityKo} 투어 & 액티비티 추천`;
  const description = city.description
    ? `${city.cityKo}에서 뭐하지? ${city.description}`
    : `${city.cityKo}에서 뭐하지? ${city.cityKo} 여행에서 꼭 해봐야 할 베스트 투어, 액티비티, 체험을 한눈에 비교하고 예약하세요.`;

  return {
    title,
    description,
    keywords: city.keywords,
    alternates: {
      canonical: `/city/${slug}`,
      languages: {
        "x-default": `/city/${slug}`,
        ko: `/city/${slug}`,
        en: `/en/city/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | trip.otobz.com`,
      description,
      url: `https://trip.otobz.com/city/${slug}`,
      siteName: "Trip OTOBZ",
      locale: "ko_KR",
      alternateLocale: ["en_US"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | trip.otobz.com`,
      description,
    },
  };
}

import type { BlogPost } from "@/data/blog-posts";

async function getRelatedPosts(cityKo: string, slug: string) {
  const blogPosts = await getMergedBlogPosts();
  const q = cityKo.toLowerCase();
  return blogPosts
    .filter(
      (p) =>
        p.title.includes(cityKo) ||
        p.keywords.some((k) => k.includes(q)) ||
        p.content.includes(cityKo) ||
        p.slug.includes(slug)
    )
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      coverImage: p.coverImage,
      coverGradient: p.coverGradient,
      coverEmoji: p.coverEmoji,
    }));
}

function CityJsonLd({ city }: { city: { cityKo: string; cityEn: string; countryKo: string; description?: string; slug: string; lat: number; lng: number } }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${city.cityKo} (${city.cityEn})`,
    description: city.description || `${city.cityKo} 여행에서 꼭 해봐야 할 베스트 투어, 액티비티, 체험`,
    url: `https://trip.otobz.com/city/${city.slug}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.lat,
      longitude: city.lng,
    },
    containedInPlace: {
      "@type": "Country",
      name: city.countryKo,
    },
    touristType: ["여행자", "관광객"],
    potentialAction: {
      "@type": "SearchAction",
      target: `https://trip.otobz.com/city/${city.slug}`,
      name: `${city.cityKo} 액티비티 검색`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = cityBySlug[slug];
  if (!city) notFound();

  const relatedPosts = await getRelatedPosts(city.cityKo, slug);

  return (
    <>
      <CityJsonLd city={city} />
      <BreadcrumbJsonLd
        items={[
          { name: "Trip OTOBZ", url: "https://trip.otobz.com/" },
          { name: "도시", url: "https://trip.otobz.com/#explore" },
          { name: city.cityKo, url: `https://trip.otobz.com/city/${slug}` },
        ]}
      />
      <CityClient city={city} relatedPosts={relatedPosts} />
    </>
  );
}
