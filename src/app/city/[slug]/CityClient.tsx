"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { City } from "@/data/cities";
import { getMylinkId, accommodationUrl, tourUrl } from "@/lib/affiliate";

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

interface AccommodationItem {
  itemId: number;
  itemName: string;
  salePrice: number;
  originalPrice: number;
  starRating: number;
  reviewScore: string;
  reviewCount: number;
}

interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage?: string;
  coverGradient: string;
  coverEmoji: string;
}

type TabId = "tour" | "accommodation";

export default function CityClient({ city, relatedPosts = [] }: { city: City; relatedPosts?: RelatedPost[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("tour");
  const [mylinkId, setMylinkId] = useState("");

  // Tour state
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<TnaCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toursLoading, setToursLoading] = useState(true);
  const [showMoreTours, setShowMoreTours] = useState(false);

  // Accommodation state
  const [accommodations, setAccommodations] = useState<AccommodationItem[]>([]);
  const [accomLoading, setAccomLoading] = useState(false);
  const [accomLoaded, setAccomLoaded] = useState(false);

  useEffect(() => {
    getMylinkId().then(setMylinkId);
  }, []);

  // 카테고리 로드
  useEffect(() => {
    fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "categories", city: city.cityKo }),
    })
      .then((r) => r.json())
      .then((json) => setCategories(json.data?.categories || []))
      .catch(() => setCategories([]));
  }, [city.cityKo]);

  // 투어 검색
  const fetchTours = useCallback(
    (category: string) => {
      setToursLoading(true);
      fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "search",
          keyword: city.cityKo,
          city: city.cityKo,
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
    [city.cityKo]
  );

  useEffect(() => {
    fetchTours(selectedCategory);
  }, [selectedCategory, fetchTours]);

  // 숙소 (탭 클릭 시 lazy 로드)
  useEffect(() => {
    if (activeTab !== "accommodation" || accomLoaded) return;
    setAccomLoading(true);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 2);
    const checkIn = tomorrow.toISOString().split("T")[0];
    const checkOut = dayAfter.toISOString().split("T")[0];

    fetch("/api/accommodation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keyword: city.cityKo,
        checkIn,
        checkOut,
        adultCount: 2,
        order: "review_desc",
        size: 20,
      }),
    })
      .then((r) => r.json())
      .then((json) => setAccommodations(json.data?.items || []))
      .catch(() => setAccommodations([]))
      .finally(() => {
        setAccomLoading(false);
        setAccomLoaded(true);
      });
  }, [activeTab, accomLoaded, city.cityKo]);

  const formatPrice = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setShowMoreTours(false);
  };

  const visibleTours = showMoreTours ? tours : tours.slice(0, 12);

  const stars = (n: number) => "★".repeat(Math.min(n, 5)) + "☆".repeat(Math.max(5 - n, 0));

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
              도시 탐색
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <p className="text-sky-500 text-sm font-semibold mb-2">
            {city.emoji} {city.countryKo}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[#222222]">
            {city.cityKo}에서 뭐하지?
          </h1>
          <p className="text-[#6a6a6a] text-lg max-w-2xl">
            {city.cityKo}에서 꼭 해봐야 할 투어, 액티비티, 체험을 한눈에 비교하세요.
          </p>
        </div>
      </section>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-100 sticky top-[53px] z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab("tour")}
              className={`px-5 py-3 text-sm font-medium transition-all ${
                activeTab === "tour"
                  ? "text-sky-600 border-b-2 border-sky-500"
                  : "text-[#6a6a6a] hover:text-[#222222]"
              }`}
            >
              투어·액티비티
            </button>
            <button
              onClick={() => setActiveTab("accommodation")}
              className={`px-5 py-3 text-sm font-medium transition-all ${
                activeTab === "accommodation"
                  ? "text-sky-600 border-b-2 border-sky-500"
                  : "text-[#6a6a6a] hover:text-[#222222]"
              }`}
            >
              숙소
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* 투어·액티비티 탭 */}
        {activeTab === "tour" && (
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#222222]">
              {city.cityKo} 베스트 액티비티
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
        )}

        {/* 숙소 탭 */}
        {activeTab === "accommodation" && (
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#222222]">
              {city.cityKo} 인기 숙소
            </h2>
            <p className="text-[#6a6a6a] text-xs mb-4">
              7일 후 체크인 · 2박 · 성인 2명 기준
            </p>

            {accomLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-500" />
              </div>
            ) : accommodations.length === 0 ? (
              <p className="text-[#6a6a6a] text-center py-12">숙소 정보가 없습니다</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accommodations.map((a) => (
                  <a
                    key={a.itemId}
                    href={accommodationUrl(mylinkId, a.itemId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl p-4 transition-all border border-gray-100 hover:border-sky-200 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#222222] font-medium truncate">{a.itemName}</h3>
                        <div className="text-amber-500 text-xs mt-1">
                          {stars(a.starRating)}
                        </div>
                        <div className="text-[#6a6a6a] text-sm mt-1">
                          {a.reviewScore} ({a.reviewCount})
                        </div>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        {a.originalPrice > a.salePrice && (
                          <div className="text-gray-400 text-sm line-through">
                            {formatPrice(a.originalPrice)}
                          </div>
                        )}
                        <div className="text-lg font-bold text-sky-600">
                          {formatPrice(a.salePrice)}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 관련 블로그 포스트 */}
        {relatedPosts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-[#222222]">
              {city.cityKo} 여행 가이드
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all group"
                >
                  {post.coverImage ? (
                    <div
                      className="h-36 bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                  ) : (
                    <div
                      className={`h-36 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}
                    >
                      <span className="text-4xl">{post.coverEmoji}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 text-[#222222] group-hover:text-sky-600 transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#6a6a6a] line-clamp-2">
                      {post.description}
                    </p>
                    <p className="text-xs text-[#999] mt-2">{post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

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
