import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cities, cityBySlug } from "@/data/cities";
import CityClient from "./CityClient";

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
    alternates: { canonical: `/city/${slug}` },
    openGraph: {
      title: `${title} | trip.otobz.com`,
      description,
      url: `https://trip.otobz.com/city/${slug}`,
      siteName: "Trip OTOBZ",
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | trip.otobz.com`,
      description,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = cityBySlug[slug];
  if (!city) notFound();

  return <CityClient city={city} />;
}
