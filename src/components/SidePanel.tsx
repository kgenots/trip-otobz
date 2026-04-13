"use client";

import { useState } from "react";
import FlightTab from "./FlightTab";
import AccommodationTab from "./AccommodationTab";
import TourTab from "./TourTab";

interface CityData {
  code: string;
  name: string;
  price: number;
}

interface SidePanelProps {
  countryCode: string;
  countryName: string;
  cities: CityData[];
  onClose: () => void;
}

const tabs = [
  { id: "flight", label: "✈️ 항공권" },
  { id: "accommodation", label: "🏨 숙소" },
  { id: "tour", label: "🎫 투어·티켓" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function SidePanel({ countryCode, countryName, cities, onClose }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("flight");

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-gray-950 border-l border-gray-800 shadow-2xl z-40 flex flex-col animate-slide-in">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">{countryName}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-white border-b-2 border-blue-500 bg-gray-900"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-5">
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
