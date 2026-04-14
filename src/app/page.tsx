"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SidePanel from "@/components/SidePanel";
import type { FlightPrice } from "@/lib/api";

const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });

const PERIODS = [3, 4, 5, 6, 7] as const;

export default function Home() {
  const [flightData, setFlightData] = useState<FlightPrice[]>([]);
  const [period, setPeriod] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<{
    code: string;
    name: string;
    price: number;
  } | null>(null);

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


  return (
    <main className="h-screen w-screen overflow-hidden bg-white relative">
      {/* 상단 헤더 */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
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
    </main>
  );
}
