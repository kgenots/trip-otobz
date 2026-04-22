import Link from "next/link";
import { cities } from "@/data/cities";

const POPULAR_SLUGS = [
  "tokyo", "osaka", "bangkok", "danang", "cebu",
  "singapore", "bali", "paris", "london", "newyork",
  "hawaii", "guam", "taipei", "hongkong",
];

const regionGroups = [
  { label: "Japan", slugs: ["tokyo", "osaka", "kyoto", "fukuoka", "sapporo", "okinawa", "nagoya"] },
  { label: "Southeast Asia", slugs: ["bangkok", "chiangmai", "phuket", "hochiminh", "hanoi", "danang", "singapore", "bali", "cebu", "manila", "kualalumpur", "kotakinabalu", "siemreap"] },
  { label: "Greater China", slugs: ["taipei", "hongkong", "macau", "shanghai", "beijing"] },
  { label: "Middle East & South Asia", slugs: ["dubai", "istanbul", "maldives"] },
  { label: "Europe", slugs: ["paris", "london", "barcelona", "rome", "amsterdam", "prague", "vienna", "zurich", "lisbon", "athens", "helsinki"] },
  { label: "Americas", slugs: ["newyork", "losangeles", "sanfrancisco", "lasvegas", "hawaii", "cancun"] },
  { label: "Pacific & Oceania", slugs: ["guam", "saipan", "sydney", "melbourne", "auckland"] },
  { label: "Africa", slugs: ["cairo"] },
];

const cityBySlug = Object.fromEntries(cities.map((c) => [c.slug, c]));

export const dynamic = "force-dynamic";

export default function EnHome() {
  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-lg sm:text-xl font-bold text-[#222222] tracking-tight">
            Trip OTOBZ
          </h1>
          <nav className="flex items-center gap-4">
            <a
              href="#explore"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              Explore Cities
            </a>
            <Link
              href="/"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
              hrefLang="ko"
            >
              한국어
            </Link>
          </nav>
        </div>
      </header>

      <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-3">
            World Travel Deals Map
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111] leading-tight mb-4">
            Click one city. Compare flights, stays, and tours.
          </h2>
          <p className="text-base sm:text-lg text-[#555] max-w-2xl mx-auto">
            Discover the best activities, tours, and deals across Tokyo, Bangkok,
            Paris, New York, and more. Built for global travelers who want
            everything in one place.
          </p>
        </div>
      </section>

      <section id="explore" className="px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-[#222] mb-6">
            Popular destinations
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {POPULAR_SLUGS.map((slug) => {
              const c = cityBySlug[slug];
              if (!c) return null;
              return (
                <Link
                  key={slug}
                  href={`/city/${slug}`}
                  className="group flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-sky-300 hover:shadow-sm transition"
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#222] group-hover:text-sky-600">
                      {c.cityEn}
                    </span>
                    <span className="text-xs text-[#888]">Best things to do</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-[#222] mb-6">
            Explore by region
          </h3>
          <div className="space-y-8">
            {regionGroups.map((group) => (
              <div key={group.label}>
                <h4 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
                  {group.label}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.slugs.map((slug) => {
                    const c = cityBySlug[slug];
                    if (!c) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/city/${slug}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-sky-50 rounded-full text-sm text-[#333] hover:text-sky-700 transition"
                      >
                        <span>{c.emoji}</span>
                        <span>{c.cityEn}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-[#222] mb-3">
            Why Trip OTOBZ
          </h3>
          <p className="text-sm sm:text-base text-[#555] max-w-2xl mx-auto mb-6">
            One map, one click, every deal. Flights, hotels, tours, and
            curated activity guides from a traveler&apos;s perspective. Korean
            guides currently available for each city — full English city pages
            rolling out.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-full text-sm font-semibold transition"
            hrefLang="ko"
          >
            View Korean site
          </Link>
        </div>
      </section>

      <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-xs text-[#888] text-center">
          © {new Date().getFullYear()} Trip OTOBZ · Global travel deals map
        </div>
      </footer>
    </main>
  );
}
