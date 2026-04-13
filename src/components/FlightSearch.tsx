"use client";

import { useState, useEffect } from "react";
import { cityCountryMap } from "@/data/city-country-map";

interface AirportOption {
  code: string;
  name: string;
  countryKo: string;
}

const AIRPORTS: AirportOption[] = Object.entries(cityCountryMap).map(([code, info]) => ({
  code,
  name: info.cityKo,
  countryKo: info.countryKo,
}));

const PERIODS = [3, 4, 5, 6, 7] as const;

export default function FlightSearch({ onSearch }: { onSearch: (params: {
  depCityCd: string;
  arrCityCd: string;
  departureDate: string;
  returnDate?: string;
  period: number;
}) => void }) {
  const [depCity, setDepCity] = useState("");
  const [arrCity, setArrCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [period, setPeriod] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // 검색 버튼 클릭 시 API 호출
  const handleSearch = async () => {
    if (!depCity || !arrCity || !departureDate) return;

    const startDate = new Date(departureDate);
    const endDate = tripType === "round" && returnDate
      ? new Date(returnDate)
      : undefined;

    if (!endDate || endDate <= startDate) {
      alert("귀국일은 출발일 이후여야 합니다");
      return;
    }

    const daysDiff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 3 || daysDiff > 7) {
      alert("왕복 여행 기간은 3~7 일 사이여야 합니다");
      return;
    }

    setLoading(true);
    onSearch({
      depCityCd: depCity,
      arrCityCd: arrCity,
      departureDate: departureDate,
      returnDate: returnDate,
      period: daysDiff,
    })
      .finally(() => setLoading(false));
  };

  // 날짜 선택 시 유효성 검사
  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDepartureDate(newDate);
    if (returnDate && newDate && new Date(newDate) >= new Date(returnDate)) {
      setReturnDate("");
    }
  };

  const handleReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setReturnDate(newDate);
    if (departureDate && newDate && new Date(newDate) <= new Date(departureDate)) {
      setDepartureDate("");
    }
  };

  // 도시 자동 완성
  const [filter, setFilter] = useState("");
  const [isDepCity, setIsDepCity] = useState(true);
  
  const filteredAirports = filter
    ? AIRPORTS.filter(a =>
        a.name.includes(filter) ||
        a.code.includes(filter.toUpperCase()) ||
        a.countryKo.includes(filter)
      ).slice(0, 10)
    : [];

  const selectAirport = (code: string) => {
    if (isDepCity) {
      setDepCity(code);
    } else {
      setArrCity(code);
    }
    setFilter("");
    setShowDropdown(false);
  };

  return (
    <div className="flex items-center gap-4 bg-gray-900/95 backdrop-blur rounded-xl px-4 py-3 border border-gray-800">
      {/* 왕복/편도 */}
      <div className="flex gap-1">
        <button
          onClick={() => setTripType("round")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tripType === "round"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          왕복
        </button>
        <button
          onClick={() => setTripType("oneway")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tripType === "oneway"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          편도
        </button>
      </div>

      <div className="w-px h-6 bg-gray-700" />

      {/* 출발지 */}
      <div className="relative">
        <label className="block text-gray-500 text-xs mb-0.5">출발지</label>
        <input
          type="text"
          value={
            depCity && cityCountryMap[depCity]
              ? `${cityCountryMap[depCity].cityKo} (${depCity})`
              : ""
          }
          placeholder="출발지 검색"
          onChange={(e) => {
            setFilter(e.target.value);
            setShowDropdown(true);
            setIsDepCity(true);
          }}
          onFocus={() => {
            setShowDropdown(true);
            setIsDepCity(true);
          }}
          className="w-40 bg-gray-800 text-white rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showDropdown && isDepCity && (
          <div className="absolute bottom-full left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto w-56 z-50">
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => selectAirport(airport.code)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors text-xs text-white"
                >
                  {airport.cityKo} ({airport.code}) - {airport.countryKo}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-xs">조회된 공항이 없습니다</div>
            )}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-700" />

      {/* 도착지 */}
      <div className="relative">
        <label className="block text-gray-500 text-xs mb-0.5">도착지</label>
        <input
          type="text"
          value={
            arrCity && cityCountryMap[arrCity]
              ? `${cityCountryMap[arrCity].cityKo} (${arrCity})`
              : ""
          }
          placeholder="도착지 검색"
          onChange={(e) => {
            setFilter(e.target.value);
            setShowDropdown(true);
            setIsDepCity(false);
          }}
          onFocus={() => {
            setShowDropdown(true);
            setIsDepCity(false);
          }}
          className="w-40 bg-gray-800 text-white rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showDropdown && !isDepCity && (
          <div className="absolute bottom-full left-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto w-56 z-50">
            {filteredAirports.length > 0 ? (
              filteredAirports.filter(a => a.code !== depCity).map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => selectAirport(airport.code)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors text-xs text-white"
                >
                  {airport.cityKo} ({airport.code}) - {airport.countryKo}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-xs">조회된 공항이 없습니다</div>
            )}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-700" />

      {/* 날짜 */}
      <div className="flex flex-col">
        <label className="block text-gray-500 text-xs mb-0.5">날짜</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={departureDate}
            onChange={handleDepartureChange}
            className="bg-gray-800 text-white rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {tripType === "round" && (
            <input
              type="date"
              value={returnDate}
              onChange={handleReturnChange}
              className="bg-gray-800 text-white rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>

      <div className="w-px h-6 bg-gray-700" />

      {/* 여행기간 */}
      <div>
        <label className="block text-gray-500 text-xs mb-0.5">여행기간</label>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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

      <div className="w-px h-6 bg-gray-700" />

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch}
        disabled={loading || !depCity || !arrCity || !departureDate}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors whitespace-nowrap"
      >
        {loading ? "로딩..." : "검색"}
      </button>
    </div>
  );
}
