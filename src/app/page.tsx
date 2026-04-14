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
      {/* 상단 컨트롤 - 모바일에서 스택 레이아웃 */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-gray-950 via-gray-950/95 to-transparent px-3 sm:px-6 py-2 sm:py-4">
        {/* 모바일: 로고와 여행기간 위, 검색폼 아래 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* 모바일: 로고 */}
          <div className="sm:hidden">
            <h1 className="text-lg font-bold text-white tracking-tight">
              ✈️ Trip OTOBZ
            </h1>
          </div>

          {/* PC: 로고 + 여행기간 */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">
                ✈️ Trip OTOBZ
              </h1>
              <span className="text-gray-500 text-sm">ICN 출발</span>
            </div>

            <div className="w-px h-6 bg-gray-700" />

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">여행기간</span>
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

          {/* 모바일: 여행기간 */}
          <div className="sm:hidden flex items-center gap-2 overflow-x-auto">
            <span className="text-gray-400 text-xs whitespace-nowrap">여행기간</span>
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
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

        {/* 검색폼 - 모바일에서 full-width */}
        <div className="mt-2 sm:mt-0">
          <FlightSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* 범례 - 모바일에서 작게 */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 z-30 bg-gray-900/90 backdrop-blur rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-800">
        <div className="text-gray-400 text-[10px] sm:text-xs mb-1.5 sm:mb-2">최저가 기준</div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] sm:text-xs text-gray-400">저렴</span>
          <div className="flex-1 max-w-[120px] sm:max-w-32 h-2 sm:h-3 rounded-full" style={{
            background: "linear-gradient(to right, rgb(34,197,94), rgb(234,179,8), rgb(239,68,68))",
          }} />
          <span className="text-[10px] sm:text-xs text-gray-400">비쌈</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
          <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-sm bg-blue-500" />
          <span className="text-[10px] sm:text-xs text-gray-400 truncate">출발지 (한국)</span>
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
