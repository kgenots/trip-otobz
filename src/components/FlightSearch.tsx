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

  // 항공권 검색 조건 변경 시 API 호출
  useEffect(() => {
    if (!depCity || !arrCity || !departureDate) return;

    const startDate = new Date(departureDate);
    const endDate = tripType === "round" && returnDate
      ? new Date(returnDate)
      : undefined;

    if (!endDate || endDate <= startDate) return;

    const daysDiff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 3 || daysDiff > 7) return;

    onSearch({
      depCityCd: depCity,
      arrCityCd: arrCity,
      departureDate: departureDate,
      returnDate: returnDate,
      period: daysDiff,
    });
  }, [depCity, arrCity, departureDate, returnDate, tripType, period, onSearch]);

  // 검색 버튼 클릭 시 API 호출
  const handleSearch = () => {
    if (!depCity || !arrCity || !departureDate) return;

    const startDate = new Date(departureDate);
    const endDate = tripType === "round" && returnDate
      ? new Date(returnDate)
      : undefined;

    if (!endDate || endDate <= startDate) return;

    const daysDiff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 3 || daysDiff > 7) {
      alert("왕복 여행 기간은 3~7 일 사이여야 합니다");
      return;
    }

    onSearch({
      depCityCd: depCity,
      arrCityCd: arrCity,
      departureDate: departureDate,
      returnDate: returnDate,
      period: daysDiff,
    });
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
  const filteredAirports = filter
    ? AIRPORTS.filter(a =>
      a.name.includes(filter) ||
      a.code.includes(filter.toUpperCase()) ||
      a.countryKo.includes(filter)
    ).slice(0, 10)
    : [];

  const selectAirport = (code: string) => {
    setDepCity(code);
    setFilter("");
    setShowDropdown(false);
  };

  return (
    <div className="absolute bottom-6 left-6 z-30 bg-gray-900/95 backdrop-blur rounded-xl p-5 border border-gray-800 w-[420px] shadow-2xl">
      {/* 타이틀 */}
      <h2 className="text-lg font-bold text-white mb-4">✈️ 항공권 검색</h2>

      {/* 왕복/편도 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTripType("round")}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tripType === "round"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          왕복
        </button>
        <button
          onClick={() => setTripType("oneway")}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tripType === "oneway"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          편도
        </button>
      </div>

      {/* 출발지 */}
      <div className="mb-3 relative">
        <label className="block text-gray-400 text-xs mb-1">출발지</label>
        <input
          type="text"
          value={
            depCity && cityCountryMap[depCity]
              ? `${cityCountryMap[depCity].cityKo} (${depCity})`
              : ""
          }
          placeholder="도쿄 (TYO) 검색"
          onChange={(e) => {
            setFilter(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showDropdown && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => selectAirport(airport.code)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors text-sm text-white"
                >
                  {airport.cityKo} ({airport.code}) - {airport.countryKo}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">조회된 공항이 없습니다</div>
            )}
          </div>
        )}
      </div>

      {/* 도착지 */}
      <div className="mb-3 relative">
        <label className="block text-gray-400 text-xs mb-1">도착지</label>
        <input
          type="text"
          value={
            arrCity && cityCountryMap[arrCity]
              ? `${cityCountryMap[arrCity].cityKo} (${arrCity})`
              : ""
          }
          placeholder="방콕 (BKK) 검색"
          onChange={(e) => {
            setFilter(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showDropdown && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredAirports.length > 0 ? (
              filteredAirports.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => {
                    if (airport.code !== depCity) {
                      setArrCity(airport.code);
                      setFilter("");
                      setShowDropdown(false);
                    }
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors text-sm text-white"
                >
                  {airport.cityKo} ({airport.code}) - {airport.countryKo}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">조회된 공항이 없습니다</div>
            )}
          </div>
        )}
      </div>

      {/* 날짜 선택 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-gray-400 text-xs mb-1"> 출발일</label>
          <input
            type="date"
            value={departureDate}
            onChange={handleDepartureChange}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {tripType === "round" && (
          <div>
            <label className="block text-gray-400 text-xs mb-1"> 귀국일</label>
            <input
              type="date"
              value={returnDate}
              onChange={handleReturnChange}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* 여행기간 */}
      <div className="mb-4">
        <label className="block text-gray-400 text-xs mb-2">여행기간</label>
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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

      {/* 검색 버튼 */}
      <button
        onClick={handleSearch}
        disabled={!depCity || !arrCity || !departureDate}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        검색
      </button>
    </div>
  );
}
