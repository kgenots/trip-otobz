"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { cities, isKorea, type City } from "@/data/cities";

const POPULAR_SLUGS = [
  "tokyo", "osaka", "bangkok", "danang", "cebu",
  "singapore", "bali", "paris", "london", "newyork",
  "hawaii", "guam", "taipei", "hongkong",
];

const regionGroups = [
  { label: "일본", slugs: ["tokyo", "osaka", "kyoto", "fukuoka", "sapporo", "okinawa", "nagoya"] },
  { label: "동남아", slugs: ["bangkok", "chiangmai", "phuket", "hochiminh", "hanoi", "danang", "singapore", "bali", "cebu", "manila", "kualalumpur", "kotakinabalu", "siemreap"] },
  { label: "중화권", slugs: ["taipei", "hongkong", "macau", "shanghai", "beijing"] },
  { label: "중동·남아시아", slugs: ["dubai", "istanbul", "maldives"] },
  { label: "유럽", slugs: ["paris", "london", "barcelona", "rome", "amsterdam", "prague", "vienna", "zurich", "lisbon", "athens", "helsinki"] },
  { label: "미주", slugs: ["newyork", "losangeles", "sanfrancisco", "lasvegas", "hawaii", "cancun"] },
  { label: "태평양·오세아니아", slugs: ["guam", "saipan", "sydney", "melbourne", "auckland"] },
  { label: "아프리카", slugs: ["cairo"] },
];

const cityBySlug = Object.fromEntries(cities.map((c) => [c.slug, c]));

type LocationState =
  | { status: "loading" }
  | { status: "korea" }
  | { status: "detected"; city: City }
  | { status: "fallback" };

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<LocationState>({ status: "loading" });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ status: "fallback" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        if (isKorea(latitude, longitude)) {
          setLocation({ status: "korea" });
          return;
        }

        // 가장 가까운 도시 찾기 (클라이언트 계산)
        let nearest: City | null = null;
        let minDist = Infinity;
        for (const city of cities) {
          const dlat = city.lat - latitude;
          const dlng = city.lng - longitude;
          const dist = dlat * dlat + dlng * dlng;
          if (dist < minDist) {
            minDist = dist;
            nearest = city;
          }
        }

        if (nearest && minDist < 25) {
          setLocation({ status: "detected", city: nearest });
        } else {
          setLocation({ status: "fallback" });
        }
      },
      () => {
        setLocation({ status: "fallback" });
      },
      { timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    return cities.filter(
      (c) =>
        c.cityKo.includes(q) ||
        c.cityEn.toLowerCase().includes(q) ||
        c.countryKo.includes(q) ||
        c.slug.includes(q)
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
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

      {/* 히어로 + 위치 인식 */}
      <section className="bg-white px-4 sm:px-8 py-10 sm:py-14 text-center border-b border-gray-100">
        {location.status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-200 border-t-sky-500 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-4xl font-bold text-[#222222] mb-2">
              현재 위치를 확인하고 있어요
            </h2>
            <p className="text-[#6a6a6a] text-sm sm:text-base">
              잠시만 기다려 주세요...
            </p>
          </>
        )}

        {location.status === "detected" && (
          <>
            <p className="text-4xl mb-3">{location.city.emoji}</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#222222] mb-2">
              {location.city.cityKo}에 계신 것 같아요!
            </h2>
            <p className="text-[#6a6a6a] mb-6 text-sm sm:text-base">
              {location.city.cityKo}에서 할 수 있는 베스트 투어·액티비티를 확인해 보세요
            </p>
            <Link
              href={`/city/${location.city.slug}`}
              className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-base shadow-sm"
            >
              {location.city.cityKo} 액티비티 보기
            </Link>
          </>
        )}

        {location.status === "korea" && (
          <>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#222222] mb-2">
              어디로 여행 가세요?
            </h2>
            <p className="text-[#6a6a6a] mb-6 text-sm sm:text-base">
              인기 여행지의 베스트 투어·액티비티를 찾아보세요
            </p>
          </>
        )}

        {location.status === "fallback" && (
          <>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#222222] mb-2">
              여행지에서 뭐하지?
            </h2>
            <p className="text-[#6a6a6a] mb-6 text-sm sm:text-base">
              전 세계 인기 도시의 베스트 투어·액티비티를 찾아보세요
            </p>
          </>
        )}

        {/* 검색바 (로딩 아닐 때만) */}
        {location.status !== "loading" && (
          <div className="max-w-md mx-auto relative mt-4">
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
            {filteredCities && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                {filteredCities.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-[#6a6a6a]">검색 결과가 없습니다</p>
                ) : (
                  filteredCities.slice(0, 8).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/city/${c.slug}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-sky-50 transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <span className="text-sm font-medium text-[#222222]">
                        {c.emoji} {c.cityKo}
                        <span className="text-[#6a6a6a] ml-1.5 font-normal">{c.countryKo}</span>
                      </span>
                      <span className="text-xs text-sky-500">액티비티 보기 &rarr;</span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 인기 여행지 카드 */}
      <section id="explore" className="bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="mb-10">
            <h3 className="text-lg font-bold text-[#222222] mb-5">인기 여행지</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {POPULAR_SLUGS.map((slug) => {
                const c = cityBySlug[slug];
                if (!c) return null;
                return (
                  <Link
                    key={slug}
                    href={`/city/${slug}`}
                    className="bg-white rounded-xl px-4 py-4 text-center border border-gray-100 hover:border-sky-300 hover:shadow-sm transition-all group"
                  >
                    <div className="text-2xl mb-1">{c.emoji}</div>
                    <div className="text-base font-semibold text-[#222222] group-hover:text-sky-600 transition-colors">
                      {c.cityKo}
                    </div>
                    <div className="text-xs text-[#6a6a6a] mt-0.5">{c.countryKo}</div>
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
                    const c = cityBySlug[slug];
                    if (!c) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/city/${slug}`}
                        className="px-3 py-1.5 rounded-full text-sm bg-white border border-gray-200 text-[#6a6a6a] hover:border-sky-300 hover:text-sky-600 transition-all"
                      >
                        {c.emoji} {c.cityKo}
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
