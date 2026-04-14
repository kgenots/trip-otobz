"use client";

import { useState, useEffect } from "react";
import { accommodationUrl } from "@/lib/affiliate";

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
  mylinkId,
}: {
  countryName: string;
  cities: CityData[];
  mylinkId: string;
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
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCity === c.name
                  ? "bg-sky-500 text-white"
                  : "bg-gray-100 text-[#6a6a6a] hover:bg-gray-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <p className="text-[#6a6a6a] text-xs mb-3">
        {checkIn} ~ {checkOut} · 성인 2명 기준
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-200 border-t-sky-500" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-[#6a6a6a] text-center py-8">숙소 정보가 없습니다</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <a
              key={item.itemId}
              href={accommodationUrl(mylinkId, item.itemId)}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl p-4 transition-all border border-gray-100 hover:border-sky-200 card-shadow-hover"
              style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.03) 0px 1px 3px" }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#222222] font-medium truncate">{item.itemName}</h3>
                  <div className="text-amber-500 text-xs mt-1">
                    {stars(item.starRating)}
                  </div>
                  <div className="text-[#6a6a6a] text-sm mt-1">
                    {item.reviewScore} ({item.reviewCount})
                  </div>
                </div>
                <div className="text-right ml-4 shrink-0">
                  {item.originalPrice > item.salePrice && (
                    <div className="text-gray-400 text-sm line-through">
                      {formatPrice(item.originalPrice)}
                    </div>
                  )}
                  <div className="text-lg font-bold text-sky-600">
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
