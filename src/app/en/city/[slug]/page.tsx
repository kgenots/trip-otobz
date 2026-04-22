import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cities, cityBySlug } from "@/data/cities";
import { blogPostsEn } from "@/data/blog-posts-en";
import CityClientEn from "./CityClientEn";
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

  const title = `${city.cityEn} Travel Guide — Best Hotels, Tours & Flights`;
  const description = `Plan your ${city.cityEn} trip: compare flight deals, hotel rates, and top tours. Honest, traveler-built guide with live pricing across Booking.com, Agoda, Klook, and more.`;

  return {
    title,
    description,
    keywords: [
      `things to do in ${city.cityEn.toLowerCase()}`,
      `${city.cityEn.toLowerCase()} travel guide`,
      `${city.cityEn.toLowerCase()} hotels`,
      `${city.cityEn.toLowerCase()} tours`,
      `${city.cityEn.toLowerCase()} flights`,
      `${city.cityEn.toLowerCase()} itinerary`,
    ],
    alternates: {
      canonical: `/en/city/${slug}`,
      languages: {
        "x-default": `/city/${slug}`,
        ko: `/city/${slug}`,
        en: `/en/city/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | Trip OTOBZ`,
      description,
      url: `https://trip.otobz.com/en/city/${slug}`,
      siteName: "Trip OTOBZ",
      locale: "en_US",
      alternateLocale: ["ko_KR"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function CityJsonLdEn({
  city,
}: {
  city: {
    cityKo: string;
    cityEn: string;
    countryKo: string;
    description?: string;
    slug: string;
    lat: number;
    lng: number;
  };
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: city.cityEn,
    alternateName: city.cityKo,
    description: `${city.cityEn} travel guide — compare hotels, tours, and flights across top providers.`,
    url: `https://trip.otobz.com/en/city/${city.slug}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: city.lat,
      longitude: city.lng,
    },
    touristType: ["Traveler", "Tourist"],
    inLanguage: "en",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function getRelatedPostsEn(cityEn: string, cityKo: string) {
  return blogPostsEn
    .filter((p) => {
      const text = `${p.title} ${p.keywords.join(" ")} ${p.content}`.toLowerCase();
      return (
        text.includes(cityEn.toLowerCase()) ||
        p.content.includes(cityKo)
      );
    })
    .slice(0, 3);
}

export default async function CityPageEn({ params }: Props) {
  const { slug } = await params;
  const city = cityBySlug[slug];
  if (!city) notFound();

  const relatedPosts = getRelatedPostsEn(city.cityEn, city.cityKo).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    coverImage: p.coverImage,
    coverGradient: p.coverGradient,
    coverEmoji: p.coverEmoji,
  }));

  return (
    <>
      <CityJsonLdEn city={city} />
      <BreadcrumbJsonLd
        items={[
          { name: "Trip OTOBZ", url: "https://trip.otobz.com/en" },
          { name: "Cities", url: "https://trip.otobz.com/en#explore" },
          { name: city.cityEn, url: `https://trip.otobz.com/en/city/${slug}` },
        ]}
      />
      <CityClientEn city={city} relatedPosts={relatedPosts} />
    </>
  );
}
