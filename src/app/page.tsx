"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import SidePanel from "@/components/SidePanel";
import FlightSearch from "@/components/FlightSearch";
import type { FlightPrice } from "@/lib/api";

const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });

const PERIODS = [3, 4, 5, 6, 7] as const;

export default function Home() {
  const [flightData, setFlightData] = useState<FlightPrice[]>([]);
  const [period, setPeriod] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<{
    code: string;
    name: string;
    cities: { code: string; name: string; price: number }[];
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

  const handleCountryClick = useCallback(
    (code: string, name: string, cities: { code: string; name: string; price: number }[]) => {
      setSelectedCountry({ code, name, cities });
    },
    []
  );

  // 검색 폼에서 검색 시 호출
  const handleSearch = async (params: {
    depCityCd: string;
    arrCityCd: string;
    departureDate: string;
    returnDate?: string;
    period: number;
  }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "window",
          depCityCd: params.depCityCd,
          arrCityCd: params.arrCityCd,
          period: params.period,
        }),
      });
      const json = await res.json();
      setFlightData(json.data || []);
    } catch (e) {
      setFlightData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-gray-950 relative">
      {/* 상단 컨트롤 - 헤더 전체 폭 */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center px-6 py-4 bg-gradient-to-b from-gray-950 via-gray-950/90 to-transparent gap-6">
        {/* 왼쪽:FlightSearch 폼 */}
        <FlightSearch onSearch={handleSearch} />

        {/* 오른쪽:로고 + 여행기간 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight">
              ✈️ Trip OTOBZ
            </h1>
            <span className="text-gray-500 text-sm hidden sm:inline">ICN 출발</span>
          </div>

          <div className="hidden sm:block w-px h-6 bg-gray-700" />

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm hidden sm:inline">여행기간</span>
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {p}일
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="absolute bottom-6 left-6 z-30 bg-gray-900/90 backdrop-blur rounded-lg px-4 py-3 border border-gray-800">
        <div className="text-gray-400 text-xs mb-2">최저가 기준</div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">저렴</span>
          <div className="w-32 h-3 rounded-full" style={{
            background: "linear-gradient(to right, rgb(34,197,94), rgb(234,179,8), rgb(239,68,68))",
          }} />
          <span className="text-xs text-gray-400">비쌈</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-xs text-gray-400">출발지 (한국)</span>
        </div>
      </div>

      {/* 로딩 */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-950/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            <p className="text-gray-400 mt-4">전 세계 최저가 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 지도 */}
      <WorldMap flightData={flightData} onCountryClick={handleCountryClick} />

      {/* 사이드패널 */}
      {selectedCountry && (
        <SidePanel
          countryCode={selectedCountry.code}
          countryName={selectedCountry.name}
          cities={selectedCountry.cities}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </main>
  );
}
