"use client";

import { useState, useEffect } from "react";
import { cityCountryMap } from "@/data/city-country-map";
import { getMylinkId } from "@/lib/affiliate";
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
  { id: "flight", label: "항공권" },
  { id: "accommodation", label: "숙소" },
  { id: "tour", label: "투어·티켓" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SidePanel({ cities, onClose }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("flight");
  const [mylinkId, setMylinkId] = useState("");
  const city = cities[0];
  const cityInfo = city ? cityCountryMap[city.code] : null;
  const countryName = cityInfo?.countryKo || "";

  useEffect(() => {
    getMylinkId().then(setMylinkId);
  }, []);

  return (
    <div className="fixed right-0 bottom-0 sm:top-0 h-full w-full sm:w-[480px] max-w-full bg-white border-t sm:border-l border-gray-200 z-40 flex flex-col animate-slide-up sm:animate-slide-in"
      style={{ boxShadow: "rgba(0,0,0,0.04) -4px 0px 12px, rgba(0,0,0,0.08) -2px 0px 6px" }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#222222] truncate">{city?.name || "선택된 도시"}</h2>
          <p className="text-sm text-[#6a6a6a] mt-0.5 truncate">{countryName}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-[#6a6a6a] hover:text-[#222222] transition-all text-lg leading-none ml-2 flex-shrink-0"
          aria-label="닫기"
        >
          x
        </button>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-100 shrink-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.id
                ? "text-sky-600 border-b-2 border-sky-500"
                : "text-[#6a6a6a] hover:text-[#222222]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y p-5">
        {activeTab === "flight" && <FlightTab cities={cities} mylinkId={mylinkId} />}
        {activeTab === "accommodation" && (
          <AccommodationTab countryName={countryName} cities={cities} mylinkId={mylinkId} />
        )}
        {activeTab === "tour" && (
          <TourTab cities={cities} mylinkId={mylinkId} />
        )}
      </div>
    </div>
  );
}
