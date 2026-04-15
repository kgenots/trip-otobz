export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Trip OTOBZ",
    url: "https://trip.otobz.com",
    description:
      "여행지에서 뭐하지? 전 세계 인기 도시의 베스트 투어, 액티비티, 체험을 한눈에 비교하고 예약하세요.",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
    },
    inLanguage: "ko",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
