"use client";

import { useEffect, useMemo, useState } from "react";
import {
  bestProviders,
  buildUrl,
  PROVIDER_LABEL,
  type Product,
} from "@/lib/affiliate-global";
import { readGeoCookie, toRegion, type Region } from "@/lib/region";
import { measureScrollDepth, trackAffiliateClick } from "@/lib/analytics";

const PRODUCT_LABEL: Record<Product, { ko: string; en: string; icon: string }> = {
  hotel:    { ko: "호텔",    en: "Hotel",    icon: "🏨" },
  tour:     { ko: "투어",    en: "Tour",     icon: "🎫" },
  activity: { ko: "액티비티", en: "Activity", icon: "🎡" },
  flight:   { ko: "항공권",  en: "Flight",   icon: "✈️" },
};

export interface SmartCTAProps {
  cityEn: string;
  cityKo: string;
  product: Product;
  stage: "browse" | "plan" | "book" | "unknown";
  placement: string;
  lang?: "ko" | "en";
  limit?: number;
  compact?: boolean;
}

export default function SmartCTA({
  cityEn,
  cityKo,
  product,
  stage,
  placement,
  lang = "ko",
  limit = 2,
  compact = false,
}: SmartCTAProps) {
  const [region, setRegion] = useState<Region>("global");
  const [mountedAt, setMountedAt] = useState<number | null>(null);

  useEffect(() => {
    setRegion(toRegion(readGeoCookie()));
    setMountedAt(Date.now());
  }, []);

  const providers = useMemo(
    () => bestProviders(region, product, limit),
    [region, product, limit]
  );

  const onClick = (provider: string) => {
    trackAffiliateClick({
      provider,
      product,
      city: cityEn,
      region,
      stage,
      placement,
      scroll_depth: measureScrollDepth(),
      time_on_page_s: mountedAt ? Math.round((Date.now() - mountedAt) / 1000) : 0,
      source_page: typeof window !== "undefined" ? window.location.pathname : "",
    });
  };

  const label = PRODUCT_LABEL[product];
  const cityLabel = lang === "ko" ? cityKo : cityEn;
  const title = lang === "ko"
    ? `${cityLabel} ${label.ko} 최저가 비교`
    : `Best ${label.en} Deals in ${cityLabel}`;
  const subtitle = lang === "ko"
    ? "실시간 가격 확인 · 무료 취소 옵션 포함"
    : "Live prices · Free cancellation options";

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => (
          <a
            key={p}
            href={buildUrl(p, { cityEn, cityKo, region, product })}
            target="_blank"
            rel="sponsored nofollow noopener"
            onClick={() => onClick(p)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-full transition"
          >
            <span>{label.icon}</span>
            <span>{PROVIDER_LABEL[p]}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="my-6 p-4 sm:p-5 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-white">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
            {label.icon} {lang === "ko" ? label.ko : label.en}
          </div>
          <h4 className="text-base sm:text-lg font-bold text-[#111]">{title}</h4>
          <p className="text-xs sm:text-sm text-[#666] mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => (
          <a
            key={p}
            href={buildUrl(p, { cityEn, cityKo, region, product })}
            target="_blank"
            rel="sponsored nofollow noopener"
            onClick={() => onClick(p)}
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-sky-200 hover:bg-sky-500 hover:text-white hover:border-sky-500 text-sky-700 text-sm font-semibold rounded-xl transition"
          >
            <span>{PROVIDER_LABEL[p]}</span>
            <span className="text-[10px] opacity-70">
              {lang === "ko" ? "보기 →" : "View →"}
            </span>
          </a>
        ))}
      </div>
      <p className="text-[10px] text-[#999] mt-3">
        {lang === "ko"
          ? "* 제휴 링크 포함. 예약 시 일정 수수료가 Trip OTOBZ에 지급될 수 있어요."
          : "* Affiliate links. Trip OTOBZ may earn a commission on bookings at no extra cost to you."}
      </p>
    </div>
  );
}
