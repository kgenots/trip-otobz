import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Trip OTOBZ — World Travel Deals Map",
  description:
    "Trip OTOBZ is a travel discovery service that compares flight, hotel, and tour deals across top destinations worldwide. Curated from a traveler's perspective.",
  alternates: {
    canonical: "/en/about",
    languages: {
      "x-default": "/about",
      ko: "/about",
      en: "/en/about",
    },
  },
  openGraph: {
    title: "About Trip OTOBZ",
    description: "World travel deals map, curated from a traveler's perspective.",
    url: "https://trip.otobz.com/en/about",
    locale: "en_US",
    alternateLocale: ["ko_KR"],
  },
};

export default function AboutPageEn() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href="/en"
            className="text-base sm:text-xl font-bold text-[#222222] hover:text-sky-600 transition-colors"
          >
            Trip OTOBZ
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#6a6a6a]">About</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-6">
          About Trip OTOBZ
        </h1>

        <p className="text-[#444] leading-7 mb-6 text-lg">
          Trip OTOBZ is a travel discovery service that compares flight, hotel,
          and tour deals across the world&apos;s top destinations in a single
          view.
        </p>

        <h2 className="text-xl font-bold text-[#222222] mt-10 mb-4">
          What we offer
        </h2>
        <ul className="list-disc list-inside space-y-2 text-[#444] leading-7">
          <li>Travel guides for 70+ popular cities (Tokyo, Bangkok, Paris, New York, and more)</li>
          <li>Flight deal comparisons (Skyscanner, Trip.com, etc.)</li>
          <li>Live hotel pricing (Booking.com, Agoda, etc.)</li>
          <li>Local tours, activities, and tickets (Klook, GetYourGuide, Viator)</li>
          <li>Honest travel blog in Korean and English</li>
        </ul>

        <h2 className="text-xl font-bold text-[#222222] mt-10 mb-4">
          Information sources
        </h2>
        <p className="text-[#444] leading-7 mb-4">
          Trip OTOBZ curates content from publicly available travel information
          and partner APIs. Prices reference real-time data from our affiliate
          partners; actual booking prices may vary based on exchange rates,
          timing, and promotional events.
        </p>

        <h2 className="text-xl font-bold text-[#222222] mt-10 mb-4">
          How we make money
        </h2>
        <p className="text-[#444] leading-7 mb-4">
          When you book hotels, tours, or flights through links on Trip OTOBZ,
          we may earn a commission from our partners. This comes{" "}
          <strong>at no additional cost to you</strong> and helps us maintain
          the service. Content selection is based on quality, price, and user
          value, independent of commission rates.
        </p>
        <p className="text-[#444] leading-7 mb-4">
          Key affiliate partnerships: Travelpayouts network (Booking.com, Agoda,
          Skyscanner, Trip.com, Airalo, etc.), Klook, MyRealTrip.
        </p>

        <h2 className="text-xl font-bold text-[#222222] mt-10 mb-4">
          Contact
        </h2>
        <p className="text-[#444] leading-7">
          Questions or feedback:{" "}
          <Link href="/en/contact" className="text-sky-600 hover:underline">
            Contact page
          </Link>
        </p>

        <div className="mt-10 pt-6 border-t border-gray-200 text-sm">
          <Link href="/about" className="text-sky-600 hover:underline" hrefLang="ko">
            한국어 버전 →
          </Link>
        </div>
      </article>
    </main>
  );
}
