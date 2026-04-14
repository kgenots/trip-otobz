"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SidePanel from "@/components/SidePanel";
import { destinations } from "@/data/destinations";
import type { FlightPrice } from "@/lib/api";

const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });

const PERIODS = [3, 4, 5, 6, 7] as const;

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

export default function Home() {
  const [flightData, setFlightData] = useState<FlightPrice[]>([]);
  const [period, setPeriod] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<{
    code: string;
    name: string;
    price: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "bulk-lowest",
        depCityCd: "ICN",
        period,
      }),
    })
      .then((r) => r.json())
      .then((json) => setFlightData(json.data || []))
      .catch(() => setFlightData([]))
      .finally(() => setLoading(false));
  }, [period]);

  const handleCityClick = useCallback(
    (code: string, name: string, price: number) => {
      setSelectedCity({ code, name, price });
    },
    []
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
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4 max-w-[1920px] mx-auto">
          <h1 className="text-base sm:text-xl font-bold text-[#222222] tracking-tight whitespace-nowrap shrink-0">
            Trip
            <span className="hidden sm:inline"> OTOBZ</span>
          </h1>
          <div className="w-px h-4 sm:h-5 bg-gray-200 shrink-0" />
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  period === p
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-gray-100 text-[#6a6a6a] hover:bg-gray-200"
                }`}
              >
                {p}일
              </button>
            ))}
          </div>
          <Link
            href="/blog"
            className="ml-auto px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium text-[#6a6a6a] hover:bg-gray-100 transition-colors shrink-0"
          >
            블로그
          </Link>
        </div>
      </div>

      {/* 지도 섹션 */}
      <div className="relative h-[60vh] sm:h-[65vh] overflow-hidden">
        {/* 로딩 */}
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-500 mx-auto" />
              <p className="text-[#6a6a6a] mt-3 text-sm font-medium">전 세계 최저가 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* 지도 */}
        <WorldMap flightData={flightData} onCityClick={handleCityClick} />

        {/* 사이드패널 */}
        {selectedCity && (
          <SidePanel
            cities={[{ code: selectedCity.code, name: selectedCity.name, price: selectedCity.price }]}
            onClose={() => setSelectedCity(null)}
          />
        )}
      </div>

      {/* 도시 탐색 섹션 */}
      <section className="border-t border-gray-100 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          {/* 검색 */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#222222] mb-3">
              여행지에서 뭐하지?
            </h2>
            <p className="text-[#6a6a6a] mb-6">도시를 선택하면 베스트 액티비티를 바로 확인할 수 있어요</p>
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도시 이름으로 검색 (예: 도쿄, 파리, Bangkok)"
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
            </div>

            {/* 검색 결과 */}
            {filteredDestinations && (
              <div className="max-w-md mx-auto mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {filteredDestinations.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-[#6a6a6a]">검색 결과가 없습니다</p>
                ) : (
                  filteredDestinations.map((d) => (
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
