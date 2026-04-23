"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PriceData {
  prediction: number | null;
  current: number | null;
  predicted: number | null;
  direction: "up" | "down" | "flat" | null;
  changePercent: number | null;
}

// Map city names to price_routes arr_code
const CITY_TO_ROUTE: Record<string, string> = {
  Bangkok: "BKK",
  Tokyo: "NRT",
  "Chiang Mai": "CNX",
  "Ho Chi Minh": "SGN",
  "Kuala Lumpur": "KUL",
  Yangon: "RGN",
  Manila: "MNL",
  Taipei: "TPE",
  Singapore: "SIN",
  Beijing: "PEK",
};

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR");
}

export default function PriceWidget({ cityEn }: { cityEn: string }) {
  const [price, setPrice] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const code = CITY_TO_ROUTE[cityEn];
    if (!code) return;

    fetch(`/api/price/search?route=${code}`)
      .then((r) => r.json())
      .then((json) => {
        const hist = (json as { history: { price: number }[] }).history || [];
        if (hist.length === 0) return;
        const current = hist[0].price;

        fetch(`/api/price/predict?route=${code}`)
          .then((r) => r.json())
          .then((pred) => {
            const p = pred as PriceData;
            setPrice({
              prediction: p.prediction ?? null,
              current,
              predicted: p.predicted ?? null,
              direction: p.direction ?? null,
              changePercent: p.changePercent ?? null,
            });
          })
          .catch(() => setLoading(false));
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [cityEn]);

  const routeCode = CITY_TO_ROUTE[cityEn];
  if (!routeCode || error) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[#222222]">
          {cityEn} 항공권 최저가
        </h3>
        <span className="text-[10px] text-[#888] uppercase tracking-wide">Seoul departures</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-5 w-12 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : price && price.current ? (
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-[#222222]">
            ₩{formatPrice(price.current)}
          </span>
          {price.predicted && price.direction && (
            <span className="text-xs font-medium flex items-center gap-1" style={{
              color: price.direction === "down" ? "#16a34a" : price.direction === "up" ? "#dc2626" : "#6b7280",
            }}>
              <span>{price.direction === "down" ? "↓" : price.direction === "up" ? "↑" : "→"}</span>
              예측: ₩{formatPrice(price.predicted)}
              {price.changePercent && ` (${price.changePercent > 0 ? "+" : ""}${formatPrice(Math.round(price.changePercent))}%)`}
            </span>
          )}
        </div>
      ) : (
        <span className="text-sm text-[#888]">데이터 수집 중...</span>
      )}

      <Link
        href={`/new/price?route=${routeCode}`}
        className="inline-block mt-3 text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors"
      >
        가격 추이 + 알림 설정 →
      </Link>
    </div>
  );
}
