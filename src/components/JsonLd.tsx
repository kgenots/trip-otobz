export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Trip OTOBZ",
    alternateName: "Trip OTOBZ — World Travel Deals Map",
    url: "https://trip.otobz.com",
    description:
      "세계지도에서 항공권·숙소·투어 최저가를 비교하고 예약. Global travel deals map — compare flights, hotels, and tours across popular cities worldwide.",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
    },
    inLanguage: ["ko", "en"],
    audience: {
      "@type": "Audience",
      geographicArea: {
        "@type": "AdministrativeArea",
        name: "Worldwide",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
