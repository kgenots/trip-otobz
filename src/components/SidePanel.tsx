"use client";

import { useState } from "react";
import { cityCountryMap } from "@/data/city-country-map";
import FlightTab from "./FlightTab";
import AccommodationTab from "./AccommodationTab";
import TourTab from "./TourTab";

interface CityData {
  code: string;
  name: string;
  price: number;
}

interface SidePanelProps {
  cities: CityData[];
  onClose: () => void;
}

const tabs = [
  { id: "flight", label: "✈️ 항공권" },
  { id: "accommodation", label: "🏨 숙소" },
  { id: "tour", label: "🎫 투어·티켓" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SidePanel({ cities, onClose }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("flight");
  const city = cities[0];
  const cityInfo = city ? cityCountryMap[city.code] : null;
  const countryName = cityInfo?.countryKo || "";

  return (
    <div className="fixed right-0 sm:right-auto bottom-0 sm:top-0 h-full sm:h-[calc(100vh-180px)] w-full sm:w-[480px] max-w-full bg-gray-950 border-t sm:border-l border-gray-800 shadow-2xl z-40 flex flex-col animate-slide-up sm:animate-slide-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-800 shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white truncate">{city?.name || "선택된 도시"}</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">{countryName}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-2xl leading-none ml-2 sm:ml-0 flex-shrink-0"
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      {/* 탭 - 모바일에서 스크롤 가능 */}
      <div className="flex border-b border-gray-800 shrink-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTab === tab.id
                ? "text-white border-b-2 border-blue-500 bg-gray-900"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 컨텐츠 - 모바일에서 터치 스크롤 최적화 */}
      <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y p-4 sm:p-5">
        {activeTab === "flight" && <FlightTab cities={cities} />}
        {activeTab === "accommodation" && (
          <AccommodationTab countryName={countryName} cities={cities} />
        )}
        {activeTab === "tour" && (
          <TourTab cities={cities} />
        )}
      </div>
    </div>
  );
}
