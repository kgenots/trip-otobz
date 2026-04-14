"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Destination } from "@/data/destinations";
import { getMylinkId, flightUrl, accommodationUrl, tourUrl } from "@/lib/affiliate";

interface TnaCategory {
  name: string;
  value: string;
}

interface Tour {
  gid: string;
  itemName: string;
  salePrice: number;
  priceDisplay: string;
  reviewScore: number;
  reviewCount: number;
  imageUrl: string;
  productUrl: string;
  category: string;
  tags: string[];
}

interface Flight {
  departureDate: string;
  returnDate: string;
  totalPrice: number;
  airline: string;
  transfer: number;
}

interface Accommodation {
  itemId: number;
  itemName: string;
  salePrice: number;
  originalPrice: number;
  starRating: string;
  reviewScore: number;
  reviewCount: number;
}

export default function DestinationClient({ destination }: { destination: Destination }) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<TnaCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toursLoading, setToursLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [auxLoading, setAuxLoading] = useState(true);
  const [mylinkId, setMylinkId] = useState("");
  const [showMoreTours, setShowMoreTours] = useState(false);

  useEffect(() => {
    getMylinkId().then(setMylinkId);
  }, []);

  // 카테고리 로드
  useEffect(() => {
    fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "categories", city: destination.cityKo }),
    })
      .then((r) => r.json())
      .then((json) => setCategories(json.data?.categories || []))
      .catch(() => setCategories([]));
  }, [destination.cityKo]);

  // 투어 검색
  const fetchTours = useCallback(
    (category: string) => {
      setToursLoading(true);
      fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "search",
          keyword: destination.cityKo,
          city: destination.cityKo,
          category: category === "all" ? undefined : category,
          sort: "review_score_desc",
          perPage: 30,
        }),
      })
        .then((r) => r.json())
        .then((json) => setTours(json.data?.items || []))
        .catch(() => setTours([]))
        .finally(() => setToursLoading(false));
    },
    [destination.cityKo]
  );

  useEffect(() => {
    fetchTours(selectedCategory);
  }, [selectedCategory, fetchTours]);

  // 항공/숙소 (보조 - lazy)
  useEffect(() => {
    const fetchAux = async () => {
      setAuxLoading(true);
      try {
        const [flightRes, accomRes] = await Promise.all([
          fetch("/api/flights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "window", depCityCd: "ICN", arrCityCd: destination.cityCode, period: 5 }),
          }).then((r) => r.json()),
          fetch("/api/accommodation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyword: destination.cityKo, adultCount: 2 }),
          }).then((r) => r.json()),
        ]);
        setFlights((flightRes.data || []).slice(0, 5));
        setAccommodations((accomRes.data?.items || []).slice(0, 4));
      } catch {
        // ignore
      } finally {
        setAuxLoading(false);
      }
    };
    fetchAux();
  }, [destination]);

  const formatPrice = (n: number) => n.toLocaleString("ko-KR") + "원";

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setShowMoreTours(false);
  };

  const visibleTours = showMoreTours ? tours : tours.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#222222]">
      {/* 헤더 */}
      <header className="border-b border-gray-100 px-4 sm:px-8 py-3 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold hover:text-sky-500 transition-colors">
            Trip OTOBZ
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              블로그
            </Link>
            <Link
              href="/"
              className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
            >
              지도
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <p className="text-sky-500 text-sm font-semibold mb-2">{destination.countryKo}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[#222222]">
            {destination.cityKo}에서 뭐하지?
          </h1>
          <p className="text-[#6a6a6a] text-lg max-w-2xl">
            {destination.cityKo}에서 꼭 해봐야 할 액티비티, 투어, 티켓을 한눈에 비교하세요.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* 액티비티 메인 섹션 */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-[#222222]">
            {destination.cityKo} 베스트 액티비티
          </h2>

          {/* 카테고리 필터 */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-white text-[#6a6a6a] border border-gray-200 hover:border-sky-300 hover:text-sky-600"
                }`}
              >
                전체
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.value
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-white text-[#6a6a6a] border border-gray-200 hover:border-sky-300 hover:text-sky-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* 투어 카드 그리드 */}
          {toursLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-500" />
            </div>
          ) : tours.length === 0 ? (
            <p className="text-[#6a6a6a] text-center py-12">액티비티 정보가 없습니다</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleTours.map((t) => (
                  <a
                    key={t.gid}
                    href={tourUrl(mylinkId, t.productUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl overflow-hidden transition-all border border-gray-100 hover:border-sky-200 hover:shadow-lg group"
                  >
                    {t.imageUrl && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={t.imageUrl}
                          alt={t.itemName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-sky-50 text-sky-600 rounded-md font-medium">
                          {t.category}
                        </span>
                        {t.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-gray-50 text-[#6a6a6a] rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-[15px] line-clamp-2 mb-2 text-[#222222] group-hover:text-sky-600 transition-colors">
                        {t.itemName}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-sky-600">
                          {t.priceDisplay || formatPrice(t.salePrice)}
                        </span>
                        {t.reviewScore > 0 && (
                          <span className="text-sm text-[#6a6a6a]">
                            <span className="text-amber-400">&#9733;</span>{" "}
                            {t.reviewScore.toFixed(1)}
                            <span className="text-xs ml-0.5">({t.reviewCount})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* 더보기 */}
              {tours.length > 12 && !showMoreTours && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowMoreTours(true)}
                    className="px-8 py-3 rounded-xl text-sm font-medium bg-white border border-gray-200 text-[#6a6a6a] hover:border-sky-300 hover:text-sky-600 transition-all"
                  >
                    액티비티 더보기 ({tours.length - 12}개)
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* 구분선 */}
        <hr className="my-12 border-gray-200" />

        {/* 보조: 이 도시 가는 법 */}
        <section className="space-y-10">
          <h2 className="text-xl font-bold text-[#222222]">
            {destination.cityKo} 가는 법
          </h2>

          {auxLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-200 border-t-sky-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 항공권 */}
              <div>
                <h3 className="text-base font-semibold mb-3 text-[#222222]">
                  최저가 항공권
                </h3>
                {flights.length === 0 ? (
                  <p className="text-sm text-[#6a6a6a]">항공편 정보를 불러올 수 없습니다.</p>
                ) : (
                  <div className="space-y-2">
                    {flights.map((f, i) => (
                      <a
                        key={i}
                        href={flightUrl(mylinkId, {
                          arrCityCd: destination.cityCode,
                          arrCityNm: destination.cityKo,
                          departureDate: f.departureDate,
                          returnDate: f.returnDate,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white rounded-xl p-3 transition-all border border-gray-100 hover:border-sky-200 hover:shadow-sm"
                      >
                        <div>
                          <span className="text-sm text-[#222222]">
                            {f.departureDate} ~ {f.returnDate}
                          </span>
                          <div className="text-xs text-[#6a6a6a] mt-0.5">
                            {f.airline} · {f.transfer === 0 ? "직항" : `경유 ${f.transfer}회`}
                          </div>
                        </div>
                        <span className="text-base font-bold text-sky-600">
                          {formatPrice(f.totalPrice)}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* 숙소 */}
              <div>
                <h3 className="text-base font-semibold mb-3 text-[#222222]">
                  인기 숙소
                </h3>
                {accommodations.length === 0 ? (
                  <p className="text-sm text-[#6a6a6a]">숙소 정보를 불러올 수 없습니다.</p>
                ) : (
                  <div className="space-y-2">
                    {accommodations.map((a) => (
                      <a
                        key={a.itemId}
                        href={accommodationUrl(mylinkId, a.itemId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white rounded-xl p-3 transition-all border border-gray-100 hover:border-sky-200 hover:shadow-sm"
                      >
                        <div className="min-w-0 flex-1 mr-3">
                          <h4 className="text-sm font-medium truncate text-[#222222]">
                            {a.itemName}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {a.starRating && (
                              <span className="text-xs text-amber-500">{a.starRating}</span>
                            )}
                            {a.reviewScore > 0 && (
                              <span className="text-xs text-[#6a6a6a]">
                                {a.reviewScore.toFixed(1)} ({a.reviewCount})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-base font-bold text-sky-600">
                            {formatPrice(a.salePrice)}
                          </span>
                          {a.originalPrice > a.salePrice && (
                            <div className="text-xs text-gray-400 line-through">
                              {formatPrice(a.originalPrice)}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <Link
            href="/"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium px-8 py-3 rounded-xl transition-all"
          >
            다른 도시 액티비티 둘러보기
          </Link>
        </section>
      </div>
    </div>
  );
}
