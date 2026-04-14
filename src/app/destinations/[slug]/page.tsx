import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { destinations, destinationBySlug } from "@/data/destinations";
import DestinationClient from "./DestinationClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = destinationBySlug[slug];
  if (!dest) return {};

  const title = `${dest.cityKo}에서 뭐하지? 베스트 액티비티·투어 추천`;
  const description = `${dest.cityKo} 여행에서 꼭 해봐야 할 액티비티, 투어, 티켓을 한눈에! ${dest.description}`;

  return {
    title,
    description,
    keywords: dest.keywords,
    alternates: { canonical: `/destinations/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://trip.otobz.com/destinations/${slug}`,
      siteName: "Trip OTOBZ",
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = destinationBySlug[slug];
  if (!dest) notFound();

  return <DestinationClient destination={dest} />;
}
