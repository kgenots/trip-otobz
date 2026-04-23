"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isKorea } from "@/data/cities";

interface PriceData {
  prediction: number | null;
  current: number | null;
  predicted: number | null;
  direction: "up" | "down" | "flat" | null;
  changePercent: number | null;
}

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
  const [userLocation, setUserLocation] = useState<"korea" | "overseas" | "unknown">("unknown");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("price-widget-confirmed")) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (isKorea(pos.coords.latitude, pos.coords.longitude)) {
          setUserLocation("korea");
        } else {
          setUserLocation("overseas");
        }
      },
      () => {},
      { timeout: 3000 }
    );
  }, []);

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
            setLoading(false);
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

  const isOverseas = userLocation === "overseas";
  const showPrice = !isOverseas || !showConfirmModal;

  const handleConfirm = () => {
    localStorage.setItem("price-widget-confirmed", "1");
    setShowConfirmModal(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[#222222]">
          {cityEn} 항공권 최저가
        </h3>
        <span className="text-[10px] text-[#888] uppercase tracking-wide">
          {userLocation === "korea" ? "Seoul departures" : "ICN departures"}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-5 w-12 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : !showPrice ? (
        <button
          onClick={() => setShowConfirmModal(true)}
          className="text-left cursor-pointer"
        >
          <span className="text-xs text-[#6a6a6a] block mb-1">
            서울(인천) 출발 항공권 최저가 확인 &rarr;
          </span>
        </button>
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

      {isOverseas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowConfirmModal(false)}>
          <div
            className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-bold text-base mb-2">항공권 가격 안내</h4>
            <p className="text-sm text-[#6a6a6a] mb-4">
              현재 표시되는 가격은 서울(인천) 출발 항공권 기준 가격입니다.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                확인 안 함
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
