export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Trip OTOBZ",
    url: "https://trip.otobz.com",
    description:
      "SVG 세계지도에서 클릭 한 번으로 전 세계 항공권, 숙소, 투어·티켓 최저가를 비교하세요.",
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
