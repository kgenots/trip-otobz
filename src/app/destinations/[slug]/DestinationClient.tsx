"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Destination } from "@/data/destinations";
import type { FlightPrice } from "@/lib/api";
import { getMylinkId, flightUrl, accommodationUrl, tourUrl } from "@/lib/affiliate";

interface Flight {
  departureDate: string;
  returnDate: string;
  totalPrice: number;
  airline: string;
  transfer: number;
  period: number;
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
}

export default function DestinationClient({ destination }: { destination: Destination }) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [mylinkId, setMylinkId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMylinkId().then(setMylinkId);

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [flightRes, accomRes, tourRes] = await Promise.all([
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
          fetch("/api/tours", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "search", keyword: destination.cityKo }),
          }).then((r) => r.json()),
        ]);
        setFlights((flightRes.data || []).slice(0, 5));
        setAccommodations((accomRes.data?.items || []).slice(0, 6));
        setTours((tourRes.data?.items || []).slice(0, 6));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [destination]);

  const formatPrice = (n: number) => n.toLocaleString("ko-KR") + "원";

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      {/* 헤더 */}
      <header className="border-b border-gray-100 px-4 sm:px-8 py-4 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold hover:text-sky-500 transition-colors">
            Trip OTOBZ
          </Link>
          <Link
            href="/"
            className="text-sm text-[#6a6a6a] hover:text-sky-500 transition-colors"
          >
            세계지도로 돌아가기
          </Link>
        </div>
      </header>

      {/* 히어로 */}
      <section className="px-4 sm:px-8 py-8 sm:py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-500 text-sm font-semibold mb-2">{destination.countryKo}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#222222]">
            {destination.cityKo} 여행 최저가
          </h1>
          <p className="text-[#6a6a6a] text-lg max-w-2xl">{destination.description}</p>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-500" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-12">
          {/* 항공권 */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#222222]">{destination.cityKo} 항공권 최저가</h2>
            {flights.length === 0 ? (
              <p className="text-[#6a6a6a]">항공권 정보를 불러올 수 없습니다.</p>
            ) : (
              <div className="grid gap-3">
                {flights.map((f, i) => (
                  <a
                    key={i}
                    href={flightUrl(mylinkId, { arrCityCd: destination.cityCode, arrCityNm: destination.cityKo, departureDate: f.departureDate, returnDate: f.returnDate })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-white rounded-xl p-4 transition-all border border-gray-100 hover:border-sky-200 card-shadow-hover"
                    style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.03) 0px 1px 3px" }}
                  >
                    <div>
                      <span className="text-sm text-[#6a6a6a]">{f.departureDate} → {f.returnDate}</span>
                      <div className="text-sm text-gray-400 mt-1">{f.airline} · {f.transfer === 0 ? "직항" : `경유 ${f.transfer}회`}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-sky-600">{formatPrice(f.totalPrice)}</div>
                      <div className="text-xs text-gray-400">왕복</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* 숙소 */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#222222]">{destination.cityKo} 인기 숙소</h2>
            {accommodations.length === 0 ? (
              <p className="text-[#6a6a6a]">숙소 정보를 불러올 수 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accommodations.map((a) => (
                  <a
                    key={a.itemId}
                    href={accommodationUrl(mylinkId, a.itemId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl p-4 transition-all border border-gray-100 hover:border-sky-200 card-shadow-hover"
                    style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.03) 0px 1px 3px" }}
                  >
                    <h3 className="font-medium text-sm line-clamp-2 mb-2 text-[#222222]">{a.itemName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {a.starRating && <span className="text-xs text-amber-500">{a.starRating}</span>}
                      {a.reviewScore > 0 && (
                        <span className="text-xs text-[#6a6a6a]">
                          {a.reviewScore.toFixed(1)} ({a.reviewCount})
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-sky-600">{formatPrice(a.salePrice)}</span>
                      {a.originalPrice > a.salePrice && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(a.originalPrice)}</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* 투어 */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#222222]">{destination.cityKo} 투어·티켓</h2>
            {tours.length === 0 ? (
              <p className="text-[#6a6a6a]">투어 정보를 불러올 수 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tours.map((t) => (
                  <a
                    key={t.gid}
                    href={tourUrl(mylinkId, t.productUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl overflow-hidden transition-all border border-gray-100 hover:border-sky-200 card-shadow-hover"
                    style={{ boxShadow: "rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.03) 0px 1px 3px" }}
                  >
                    {t.imageUrl && (
                      <img src={t.imageUrl} alt={t.itemName} className="w-full h-36 object-cover" />
                    )}
                    <div className="p-4">
                      <span className="text-xs text-sky-500 mb-1 block font-medium">{t.category}</span>
                      <h3 className="font-medium text-sm line-clamp-2 mb-2 text-[#222222]">{t.itemName}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-sky-600">{t.priceDisplay || formatPrice(t.salePrice)}</span>
                        {t.reviewScore > 0 && (
                          <span className="text-xs text-[#6a6a6a]">
                            {t.reviewScore.toFixed(1)} ({t.reviewCount})
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="text-center py-8">
            <Link
              href="/"
              className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-medium px-8 py-3 rounded-xl transition-all"
            >
              세계지도에서 더 많은 여행지 보기
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}
