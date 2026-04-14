"use client";

import { useState, useEffect } from "react";
import { flightUrl } from "@/lib/affiliate";

interface CityData {
  code: string;
  name: string;
  price: number;
}

interface FlightDetail {
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate: string | null;
  totalPrice: number;
  airline: string | null;
  transfer: number | null;
  period: number | null;
}

export default function FlightTab({ cities, mylinkId }: { cities: CityData[]; mylinkId: string }) {
  const [selectedCity, setSelectedCity] = useState(cities[0]?.code || "");
  const [flights, setFlights] = useState<FlightDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCity) return;
    setLoading(true);
    fetch("/api/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "window",
        depCityCd: "ICN",
        arrCityCd: selectedCity,
        period: 5,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          const sorted = [...json.data].sort(
            (a: FlightDetail, b: FlightDetail) => a.totalPrice - b.totalPrice
          );
          setFlights(sorted.slice(0, 30));
        }
      })
      .catch(() => setFlights([]))
      .finally(() => setLoading(false));
  }, [selectedCity]);

  const formatPrice = (p: number) => `₩${p.toLocaleString("ko-KR")}`;
  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}(${["일","월","화","수","목","금","토"][date.getDay()]})`;
  };

  return (
    <div>
      {/* 도시 선택 */}
      {cities.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {cities.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCity(c.code)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCity === c.code
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : flights.length === 0 ? (
        <p className="text-gray-500 text-center py-8">항공편 정보가 없습니다</p>
      ) : (
        <div className="space-y-2">
          {flights.map((f, i) => (
            <a
              key={i}
              href={flightUrl(mylinkId, { depCityCd: "ICN", arrCityCd: f.toCity, departDate: f.departureDate, returnDate: f.returnDate || undefined })}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors border border-gray-800 hover:border-gray-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">
                    {formatDate(f.departureDate)}
                    {f.returnDate && (
                      <span className="text-gray-400"> → {formatDate(f.returnDate)}</span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    {f.airline || "다양한 항공사"}
                    {f.transfer !== null && f.transfer > 0
                      ? ` · 경유 ${f.transfer}회`
                      : f.transfer === 0
                        ? " · 직항"
                        : ""}
                    {f.period && ` · ${f.period}일`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-400">
                    {formatPrice(f.totalPrice)}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
