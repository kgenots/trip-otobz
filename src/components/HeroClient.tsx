"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { cities, isKorea, type City } from "@/data/cities";

type LocationState =
  | { status: "ready"; detected?: City }
  | { status: "korea" };

export default function HeroClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<LocationState>({ status: "ready" });

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        if (isKorea(latitude, longitude)) {
          setLocation({ status: "korea" });
          return;
        }

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
          setLocation({ status: "ready", detected: nearest });
        }
      },
      () => {},
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

  const detected = location.status === "ready" ? location.detected : undefined;

  return (
    <section className="bg-white px-4 sm:px-8 py-10 sm:py-14 text-center border-b border-gray-100">
      {detected ? (
        <>
          <p className="text-4xl mb-3">{detected.emoji}</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#222222] mb-2">
            {detected.cityKo}에 계신 것 같아요!
          </h2>
          <p className="text-[#6a6a6a] mb-6 text-sm sm:text-base">
            {detected.cityKo}에서 할 수 있는 베스트 투어·액티비티를 확인해 보세요
          </p>
          <Link
            href={`/city/${detected.slug}`}
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-base shadow-sm"
          >
            {detected.cityKo} 액티비티 보기
          </Link>
        </>
      ) : location.status === "korea" ? (
        <>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#222222] mb-2">
            어디로 여행 가세요?
          </h2>
          <p className="text-[#6a6a6a] mb-6 text-sm sm:text-base">
            인기 여행지의 베스트 투어·액티비티를 찾아보세요
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#222222] mb-2">
            여행지에서 뭐하지?
          </h2>
          <p className="text-[#6a6a6a] mb-6 text-sm sm:text-base">
            전 세계 인기 도시의 베스트 투어·액티비티를 찾아보세요
          </p>
        </>
      )}

      {/* 검색바 */}
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
    </section>
  );
}
