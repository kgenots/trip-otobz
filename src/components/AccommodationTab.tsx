"use client";

import { useState, useEffect } from "react";

interface CityData {
  code: string;
  name: string;
  price: number;
}

interface AccommodationItem {
  itemId: number;
  itemName: string;
  salePrice: number;
  originalPrice: number;
  starRating: number;
  reviewScore: string;
  reviewCount: number;
}

export default function AccommodationTab({
  countryName,
  cities,
}: {
  countryName: string;
  cities: CityData[];
}) {
  const [selectedCity, setSelectedCity] = useState(cities[0]?.name || "");
  const [items, setItems] = useState<AccommodationItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 체크인: 내일, 체크아웃: 모레
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 2);
  const checkIn = tomorrow.toISOString().split("T")[0];
  const checkOut = dayAfter.toISOString().split("T")[0];

  useEffect(() => {
    if (!selectedCity) return;
    setLoading(true);
    fetch("/api/accommodation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keyword: selectedCity,
        checkIn,
        checkOut,
        adultCount: 2,
        order: "review_desc",
        size: 20,
      }),
    })
      .then((r) => r.json())
      .then((json) => setItems(json.data?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [selectedCity, checkIn, checkOut]);

  const formatPrice = (p: number) => `₩${p.toLocaleString("ko-KR")}`;
  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div>
      {/* 도시 선택 */}
      {cities.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {cities.map((c) => (
            <button
              key={c.code}
              onClick={() => setSelectedCity(c.name)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                selectedCity === c.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <p className="text-gray-500 text-xs mb-3">
        {checkIn} ~ {checkOut} · 성인 2명 기준
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">숙소 정보가 없습니다</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <a
              key={item.itemId}
              href={`https://www.myrealtrip.com/accommodations/${item.itemId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors border border-gray-800 hover:border-gray-600"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{item.itemName}</h3>
                  <div className="text-yellow-400 text-xs mt-1">
                    {stars(item.starRating)}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    ⭐ {item.reviewScore} ({item.reviewCount})
                  </div>
                </div>
                <div className="text-right ml-4 shrink-0">
                  {item.originalPrice > item.salePrice && (
                    <div className="text-gray-500 text-sm line-through">
                      {formatPrice(item.originalPrice)}
                    </div>
                  )}
                  <div className="text-lg font-bold text-emerald-400">
                    {formatPrice(item.salePrice)}
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
