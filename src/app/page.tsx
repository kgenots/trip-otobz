"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";
import { cityCountryMap } from "@/data/city-country-map";
import type { FlightPrice } from "@/lib/api";

const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });

const POPULAR_DESTINATIONS = [
  "tokyo", "osaka", "bangkok", "danang", "cebu",
  "singapore", "bali", "paris", "london", "honolulu",
  "dubai", "rome", "barcelona", "taipei",
];

const regionGroups = [
  { label: "일본", slugs: ["tokyo", "osaka", "fukuoka", "sapporo", "okinawa", "nagoya"] },
  { label: "동남아", slugs: ["bangkok", "danang", "hanoi", "cebu", "singapore", "bali", "chiangmai", "phuket", "hochiminh", "kualalumpur", "kotakinabalu", "manila", "siemreap"] },
  { label: "유럽", slugs: ["paris", "london", "rome", "barcelona", "amsterdam", "prague", "vienna", "zurich", "lisbon", "athens", "helsinki"] },
  { label: "미주·태평양", slugs: ["honolulu", "guam", "saipan", "losangeles", "newyork", "sanfrancisco", "lasvegas", "cancun"] },
  { label: "기타", slugs: ["taipei", "hongkong", "macau", "beijing", "shanghai", "dubai", "istanbul", "maldives", "sydney", "melbourne", "auckland", "cairo"] },
];

const destBySlug = Object.fromEntries(destinations.map((d) => [d.slug, d]));
const destByCityCode = Object.fromEntries(destinations.map((d) => [d.cityCode, d]));

export default function Home() {
  const router = useRouter();
  const [flightData, setFlightData] = useState<FlightPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bulk-lowest", depCityCd: "ICN", period: 5 }),
    })
      .then((r) => r.json())
      .then((json) => setFlightData(json.data || []))
      .catch(() => setFlightData([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCityClick = useCallback(
    (code: string, _name: string, _price: number) => {
      // cityCode → destination slug로 매핑해서 바로 이동
      const dest = destByCityCode[code];
      if (dest) {
        router.push(`/destinations/${dest.slug}`);
        return;
      }
      // cityCountryMap에서 cityCode의 다른 변형 체크
      const info = cityCountryMap[code];
      if (info) {
        const found = destinations.find((d) => d.cityKo === info.cityKo);
        if (found) {
          router.push(`/destinations/${found.slug}`);
          return;
        }
      }
    },
    [router]
  );

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    return destinations.filter(
      (d) =>
        d.cityKo.includes(q) ||
        d.countryKo.includes(q) ||
        d.slug.includes(q)
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <h1 className="text-lg sm:text-xl font-bold text-[#222222] tracking-tight">
            Trip OTOBZ
          </h1>
          <nav className="flex items-center gap-4">
            <a
              href="#explore"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              도시 탐색
            </a>
            <Link
              href="/blog"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              블로그
            </Link>
          </nav>
        </div>
      </header>

      {/* 히어로 + 검색 */}
      <section className="bg-white px-4 sm:px-8 py-8 sm:py-10 text-center border-b border-gray-100">
        <h2 className="text-2xl sm:text-4xl font-bold text-[#222222] mb-2">
          여행지에서 뭐하지?
        </h2>
        <p className="text-[#6a6a6a] mb-6 text-sm sm:text-base">
          지도에서 도시를 클릭하거나 검색해서 베스트 액티비티를 찾아보세요
        </p>
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="어디로 가시나요? (예: 도쿄, 파리, Bangkok)"
            className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white text-[#222222] placeholder-gray-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >
              &times;
            </button>
          )}

          {/* 검색 결과 드롭다운 */}
          {filteredDestinations && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
              {filteredDestinations.length === 0 ? (
                <p className="px-4 py-3 text-sm text-[#6a6a6a]">검색 결과가 없습니다</p>
              ) : (
                filteredDestinations.slice(0, 8).map((d) => (
                  <Link
                    key={d.slug}
                    href={`/destinations/${d.slug}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-sky-50 transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <span className="text-sm font-medium text-[#222222]">
                      {d.cityKo}
                      <span className="text-[#6a6a6a] ml-1.5 font-normal">{d.countryKo}</span>
                    </span>
                    <span className="text-xs text-sky-500">액티비티 보기 &rarr;</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* 지도 */}
      <section className="relative h-[50vh] sm:h-[55vh] border-b border-gray-100">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-500 mx-auto" />
              <p className="text-[#6a6a6a] mt-3 text-sm font-medium">지도 불러오는 중...</p>
            </div>
          </div>
        )}
        <WorldMap flightData={flightData} onCityClick={handleCityClick} />
      </section>

      {/* 도시 탐색 */}
      <section id="explore" className="bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          {/* 인기 도시 */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-[#222222] mb-4">인기 여행지</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {POPULAR_DESTINATIONS.map((slug) => {
                const d = destBySlug[slug];
                if (!d) return null;
                return (
                  <Link
                    key={slug}
                    href={`/destinations/${slug}`}
                    className="bg-white rounded-xl px-4 py-3 text-center border border-gray-100 hover:border-sky-300 hover:shadow-sm transition-all group"
                  >
                    <div className="text-base font-semibold text-[#222222] group-hover:text-sky-600 transition-colors">
                      {d.cityKo}
                    </div>
                    <div className="text-xs text-[#6a6a6a] mt-0.5">{d.countryKo}</div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 지역별 도시 */}
          <div className="space-y-6">
            {regionGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-base font-bold text-[#222222] mb-3">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.slugs.map((slug) => {
                    const d = destBySlug[slug];
                    if (!d) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/destinations/${slug}`}
                        className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 text-[#6a6a6a] hover:border-sky-300 hover:text-sky-600 transition-all"
                      >
                        {d.cityKo}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
