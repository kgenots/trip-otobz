"use client";

import { useState, useEffect } from "react";

interface CityData {
  code: string;
  name: string;
  price: number;
}

interface TnaCategory {
  name: string;
  value: string;
}

interface TnaItem {
  gid: string;
  itemName: string;
  description: string;
  salePrice: number;
  priceDisplay: string;
  category: string;
  reviewScore: number;
  reviewCount: number;
  imageUrl: string;
  productUrl: string;
  tags: string[];
}

export default function TourTab({ cities }: { cities: CityData[] }) {
  const [selectedCity, setSelectedCity] = useState(cities[0]?.name || "");
  const [categories, setCategories] = useState<TnaCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState<TnaItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 카테고리 로드
  useEffect(() => {
    if (!selectedCity) return;
    fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "categories", city: selectedCity }),
    })
      .then((r) => r.json())
      .then((json) => {
        setCategories(json.data?.categories || []);
        setSelectedCategory("all");
      })
      .catch(() => setCategories([]));
  }, [selectedCity]);

  // 상품 검색
  useEffect(() => {
    if (!selectedCity) return;
    setLoading(true);
    fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "search",
        keyword: selectedCity,
        city: selectedCity,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        sort: "review_score_desc",
        perPage: 20,
      }),
    })
      .then((r) => r.json())
      .then((json) => setItems(json.data?.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [selectedCity, selectedCategory]);

  const formatPrice = (p: number) => `₩${p.toLocaleString("ko-KR")}`;

  return (
    <div>
      {/* 도시 선택 */}
      {cities.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
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

      {/* 카테고리 필터 */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedCategory === cat.value
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">투어·티켓 정보가 없습니다</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <a
              key={item.gid}
              href={item.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors border border-gray-800 hover:border-gray-600"
            >
              <div className="flex">
                {item.imageUrl && (
                  <div className="w-24 h-24 shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-3 min-w-0">
                  <h3 className="text-white text-sm font-medium line-clamp-2">
                    {item.itemName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {item.reviewScore > 0 && (
                      <span className="text-gray-400 text-xs">
                        ⭐ {item.reviewScore} ({item.reviewCount})
                      </span>
                    )}
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 bg-blue-900 text-blue-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-emerald-400 font-bold mt-1">
                    {formatPrice(item.salePrice)}~
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
