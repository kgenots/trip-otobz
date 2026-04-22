"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { City } from "@/data/cities";
import { getMylinkId, accommodationUrl, klookSearchUrl } from "@/lib/affiliate";
import BookingBar from "@/components/BookingBar";
import SmartCTA from "@/components/SmartCTA";
import { readGeoCookie, toRegion, type Region } from "@/lib/region";

interface Activity {
  id: number;
  source: "myrealtrip" | "klook";
  sourceId: string;
  description?: string;
  title: string;
  price: number | null;
  priceDisplay: string | null;
  imageUrl: string | null;
  affiliateUrl: string;
  category: string | null;
  tags: string[];
  rating: number | null;
  reviewCount: number;
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
type SourceFilter = "all" | "myrealtrip" | "klook";

function SourceBadge({ source }: { source: "myrealtrip" | "klook" }) {
  if (source === "myrealtrip") {
    return (
      <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">
        마이리얼트립
      </span>
    );
  }
  return (
    <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded font-medium">
      Klook
    </span>
  );
}

export default function CityClient({ city, relatedPosts = [] }: { city: City; relatedPosts?: RelatedPost[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("tour");
  const [mylinkId, setMylinkId] = useState("");
  const [region, setRegion] = useState<Region>("global");

  useEffect(() => {
    setRegion(toRegion(readGeoCookie()));
  }, []);
  const isKoreaUser = region === "kr";

  // Activity state (DB)
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");
  const [showMore, setShowMore] = useState(false);
  const [useDbData, setUseDbData] = useState(true);

  // Fallback: direct API (기존 방식)
  const [fallbackTours, setFallbackTours] = useState<Activity[]>([]);
  const [fallbackLoading, setFallbackLoading] = useState(false);

  // Accommodation state (DB first, fallback to realtime)
  const [dbAccom, setDbAccom] = useState<Activity[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationItem[]>([]);
  const [accomLoading, setAccomLoading] = useState(false);
  const [accomLoaded, setAccomLoaded] = useState(false);
  const [useDbAccom, setUseDbAccom] = useState(true);

  useEffect(() => {
    getMylinkId().then(setMylinkId);
  }, []);

  // DB에서 액티비티 로드
  const fetchActivities = useCallback(
    (source: SourceFilter, category: string | null, sort: string) => {
      setActivitiesLoading(true);
      const catParam = category ? `&category=${encodeURIComponent(category)}` : "";
      fetch(`/api/activities?city=${city.slug}&source=${source}&perPage=60&sort=${sort}${catParam}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.data?.items?.length > 0 || json.data?.categories?.length > 0) {
            setActivities(json.data.items || []);
            setSourceCounts(json.data.sources || {});
            if (!category) setCategories(json.data.categories || []);
            setUseDbData(true);
          } else {
            setUseDbData(false);
          }
        })
        .catch(() => setUseDbData(false))
        .finally(() => setActivitiesLoading(false));
    },
    [city.slug]
  );

  // Fallback: 실시간 마이리얼트립 API
  const fetchFallbackTours = useCallback(() => {
    setFallbackLoading(true);
    fetch("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "search",
        keyword: city.cityKo,
        city: city.cityKo,
        sort: "review_score_desc",
        perPage: 30,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const items = json.data?.items || [];
        setFallbackTours(
          items.map((t: Record<string, unknown>) => ({
            id: 0,
            source: "myrealtrip" as const,
            sourceId: t.gid as string,
            title: t.itemName as string,
            price: (t.salePrice as number) || null,
            priceDisplay: (t.priceDisplay as string) || null,
            imageUrl: (t.imageUrl as string) || null,
            affiliateUrl: (t.productUrl as string) || "",
            category: (t.category as string) || null,
            tags: (t.tags as string[]) || [],
            rating: (t.reviewScore as number) || null,
            reviewCount: (t.reviewCount as number) || 0,
          }))
        );
      })
      .catch(() => setFallbackTours([]))
      .finally(() => setFallbackLoading(false));
  }, [city.cityKo]);

  useEffect(() => {
    fetchActivities(sourceFilter, selectedCategory, sortBy);
  }, [sourceFilter, selectedCategory, sortBy, fetchActivities]);

  useEffect(() => {
    if (!useDbData && !activitiesLoading && fallbackTours.length === 0) {
      fetchFallbackTours();
    }
  }, [useDbData, activitiesLoading, fallbackTours.length, fetchFallbackTours]);

  // 숙소 (탭 클릭 시 lazy 로드 — DB → fallback)
  useEffect(() => {
    if (activeTab !== "accommodation" || accomLoaded) return;
    setAccomLoading(true);

    // DB에서 먼저 시도
    fetch(`/api/activities?city=${city.slug}&category=숙소&perPage=30&sort=rating`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.items?.length > 0) {
          setDbAccom(json.data.items);
          setUseDbAccom(true);
          setAccomLoading(false);
          setAccomLoaded(true);
        } else {
          throw new Error("no db data");
        }
      })
      .catch(() => {
        // Fallback: 실시간 API
        setUseDbAccom(false);
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
            keyword: city.cityKo, checkIn, checkOut, adultCount: 2, order: "review_desc", size: 20,
          }),
        })
          .then((r) => r.json())
          .then((json) => setAccommodations(json.data?.items || []))
          .catch(() => setAccommodations([]))
          .finally(() => { setAccomLoading(false); setAccomLoaded(true); });
      });
  }, [activeTab, accomLoaded, city.cityKo, city.slug]);

  const formatPrice = (n: number) => `₩${n.toLocaleString("ko-KR")}`;
  const stars = (n: number) => "★".repeat(Math.min(n, 5)) + "☆".repeat(Math.max(5 - n, 0));

  const displayActivities = useDbData ? activities : fallbackTours;
  const isLoading = useDbData ? activitiesLoading : fallbackLoading;
  const visibleActivities = showMore ? displayActivities : displayActivities.slice(0, 12);
  const totalMrt = sourceCounts["myrealtrip"] || 0;
  const totalKlook = sourceCounts["klook"] || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#222222]">
      {/* 헤더 */}
      <header className="border-b border-gray-100 px-4 sm:px-8 py-3 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold hover:text-sky-500 transition-colors">
            Trip OTOBZ
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors">
              블로그
            </Link>
            <Link href="/" className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors">
              도시 탐색
            </Link>
            <Link
              href={`/en/city/${city.slug}`}
              className="text-xs text-[#888] hover:text-sky-600"
              hrefLang="en"
            >
              EN
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

      {/* 예약 바 — 호텔·투어·항공권 (geo-aware) */}
      <section className="bg-gradient-to-b from-sky-50/50 to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
          <BookingBar
            cityEn={city.cityEn}
            cityKo={city.cityKo}
            stage="plan"
            placement="city-top"
            lang="ko"
            products={["hotel", "tour", "flight"]}
          />
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

            {/* Source 필터 */}
            {useDbData && (totalMrt > 0 || totalKlook > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {(["all", "myrealtrip", "klook"] as SourceFilter[]).map((s) => {
                  const label = s === "all" ? "전체" : s === "myrealtrip" ? "마이리얼트립" : "Klook";
                  const count = s === "all" ? totalMrt + totalKlook : s === "myrealtrip" ? totalMrt : totalKlook;
                  if (s !== "all" && count === 0) return null;
                  return (
                    <button
                      key={s}
                      onClick={() => { setSourceFilter(s); setShowMore(false); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        sourceFilter === s
                          ? "bg-sky-500 text-white shadow-sm"
                          : "bg-white text-[#6a6a6a] border border-gray-200 hover:border-sky-300 hover:text-sky-600"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* 카테고리 필터 */}
            {useDbData && categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => { setSelectedCategory(null); setShowMore(false); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-white text-[#6a6a6a] border border-gray-200 hover:border-sky-300 hover:text-sky-600"
                  }`}
                >
                  전체
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat.name); setShowMore(false); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.name
                        ? "bg-sky-500 text-white shadow-sm"
                        : "bg-white text-[#6a6a6a] border border-gray-200 hover:border-sky-300 hover:text-sky-600"
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            )}

            {/* 정렬 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {([
                ["rating", "인기순"],
                ["price_asc", "가격 낮은순"],
                ["price_desc", "가격 높은순"],
              ] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => { setSortBy(val); setShowMore(false); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === val
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-white text-[#6a6a6a] border border-gray-200 hover:border-sky-300 hover:text-sky-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 카드 그리드 */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-500" />
              </div>
            ) : displayActivities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6a6a6a] mb-4">액티비티 정보가 없습니다</p>
                <a
                  href={klookSearchUrl(city.cityKo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Klook에서 검색하기
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visibleActivities.map((a) => (
                    <a
                      key={`${a.source}-${a.sourceId}`}
                      href={a.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-2xl overflow-hidden transition-all border border-gray-100 hover:border-sky-200 hover:shadow-lg group"
                    >
                      {a.imageUrl && (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={a.imageUrl}
                            alt={a.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          <SourceBadge source={a.source} />
                          {a.category && (
                            <span className="text-xs px-2 py-0.5 bg-sky-50 text-sky-600 rounded-md font-medium">
                              {a.category}
                            </span>
                          )}
                          {a.tags.slice(0, 1).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-50 text-[#6a6a6a] rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-semibold text-[15px] line-clamp-2 mb-2 text-[#222222] group-hover:text-sky-600 transition-colors">
                          {a.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-sky-600">
                            {a.priceDisplay || (a.price ? formatPrice(a.price) : "")}
                          </span>
                          {a.rating && a.rating > 0 && (
                            <span className="text-sm text-[#6a6a6a]">
                              <span className="text-amber-400">&#9733;</span>{" "}
                              {a.rating.toFixed(1)}
                              <span className="text-xs ml-0.5">({a.reviewCount})</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {displayActivities.length > 12 && !showMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setShowMore(true)}
                      className="px-8 py-3 rounded-xl text-sm font-medium bg-white border border-gray-200 text-[#6a6a6a] hover:border-sky-300 hover:text-sky-600 transition-all"
                    >
                      액티비티 더보기 ({displayActivities.length - 12}개)
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

            {!isKoreaUser ? (
              <div className="py-4">
                <SmartCTA
                  cityEn={city.cityEn}
                  cityKo={city.cityKo}
                  product="hotel"
                  stage="book"
                  placement="city-accom-nonkr"
                  lang="ko"
                  limit={3}
                />
                <p className="text-xs text-[#888] mt-3 text-center">
                  MyRealTrip listings are available in Korea only. Global users: use providers above.
                </p>
              </div>
            ) : accomLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-500" />
              </div>
            ) : useDbAccom && dbAccom.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dbAccom.map((a) => (
                  <a
                    key={a.sourceId}
                    href={a.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl p-4 transition-all border border-gray-100 hover:border-sky-200 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#222222] font-medium truncate">{a.title}</h3>
                        {a.description && (
                          <div className="text-amber-500 text-xs mt-1">{a.description}</div>
                        )}
                        {a.rating && (
                          <div className="text-[#6a6a6a] text-sm mt-1">
                            {a.rating.toFixed(1)} ({a.reviewCount})
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <div className="text-lg font-bold text-sky-600">
                          {a.priceDisplay || (a.price ? formatPrice(a.price) : "")}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
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
                        <div className="text-amber-500 text-xs mt-1">{stars(a.starRating)}</div>
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

        {/* 하단 CTA — 호텔 집중 (최고 커미션) */}
        <section className="mt-10">
          <SmartCTA
            cityEn={city.cityEn}
            cityKo={city.cityKo}
            product="hotel"
            stage="book"
            placement="city-bottom"
            lang="ko"
            limit={3}
          />
        </section>

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
                    <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }} />
                  ) : (
                    <div className={`h-36 bg-gradient-to-br ${post.coverGradient} flex items-center justify-center`}>
                      <span className="text-4xl">{post.coverEmoji}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 text-[#222222] group-hover:text-sky-600 transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#6a6a6a] line-clamp-2">{post.description}</p>
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
