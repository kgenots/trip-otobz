import { cityBySlug } from "@/data/cities";
import { AGODA_CITY_SLUG, SLUG_ISO } from "@/lib/slug-iso";

const TP_MARKER = process.env.NEXT_PUBLIC_TP_MARKER || "";

// impact.com 승인 후 env 주입 시 자동 래핑
// IMPACT_SKYSCANNER_URL 예: "https://goto.walnut.impact.com/c/{CAMPAIGN_ID}/{AD_ID}/{PUBLISHER_ID}"
const IMPACT_SKYSCANNER_URL = process.env.NEXT_PUBLIC_IMPACT_SKYSCANNER_URL || "";
const IMPACT_SUBID_PARAM = process.env.NEXT_PUBLIC_IMPACT_SUBID_PARAM || "subId1";

function wrapImpact(target: string, campaign: string): string {
  if (!IMPACT_SKYSCANNER_URL) return target;
  const u = encodeURIComponent(target);
  const sep = IMPACT_SKYSCANNER_URL.includes("?") ? "&" : "?";
  return `${IMPACT_SKYSCANNER_URL}${sep}u=${u}&${IMPACT_SUBID_PARAM}=${encodeURIComponent(campaign)}`;
}

export type OutboundInput = {
  slug: string;
  arrCode?: string; // IATA 공항 코드
  depart?: string; // YYYY-MM-DD
  return?: string; // YYYY-MM-DD
};

function yymmdd(ymd: string): string {
  return ymd.replace(/-/g, "").slice(2);
}

function tpLabel(campaign: string): string {
  return TP_MARKER ? `tp-${TP_MARKER}-${campaign}` : "";
}

function appendParams(url: string, kv: Record<string, string>): string {
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(kv)) {
      if (v) u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Skyscanner 실제 검색 URL
 * https://www.skyscanner.co.kr/transport/flights/icn/{arr}/{yymmdd}/{yymmdd}/
 * - arrCode 없으면 도시명 검색 페이지
 */
export function flightOutbound(input: OutboundInput): string | null {
  const city = cityBySlug[input.slug];
  if (!city) return null;
  const cityEnSlug = city.cityEn.toLowerCase().replace(/\s+/g, "-");
  const campaign = `flight-${cityEnSlug}-kr`;
  const label = tpLabel(campaign);

  const arr = (input.arrCode || "").toLowerCase();
  let url: string;
  if (arr && input.depart && input.return) {
    url = `https://www.skyscanner.co.kr/transport/flights/icn/${arr}/${yymmdd(input.depart)}/${yymmdd(input.return)}/`;
  } else if (arr && input.depart) {
    url = `https://www.skyscanner.co.kr/transport/flights/icn/${arr}/${yymmdd(input.depart)}/`;
  } else {
    url = `https://www.skyscanner.co.kr/transport/flights-from/icn/?destination=${encodeURIComponent(city.cityEn)}`;
  }

  const params: Record<string, string> = {
    utm_source: "otobz-trip",
    utm_medium: "affiliate",
    utm_campaign: "skyscanner",
    utm_content: "flight-kr",
  };
  if (label) params.label = label;
  const direct = appendParams(url, params);
  // impact.com 승인 후 env 있으면 래핑 (없으면 direct + TP label fallback)
  return wrapImpact(direct, campaign);
}

/**
 * Agoda 도시 호텔 페이지
 * https://www.agoda.com/ko-kr/city/{agoda-slug}-{iso-lower}.html?checkIn=...&checkOut=...
 * - agoda-slug/iso 맵 없으면 Booking fallback
 */
export function hotelOutbound(input: OutboundInput): string | null {
  const city = cityBySlug[input.slug];
  if (!city) return null;
  const agodaSlug = AGODA_CITY_SLUG[input.slug];
  const iso = SLUG_ISO[input.slug];
  const cityEnSlug = city.cityEn.toLowerCase().replace(/\s+/g, "-");
  const campaign = `hotel-${cityEnSlug}-kr`;
  const label = tpLabel(campaign);

  if (!agodaSlug || !iso) {
    return hotelOutboundBooking(input);
  }

  // Agoda city URL은 city slug에 국가 suffix 이미 포함된 경우 있음 (fukuoka, hawaii-us 등)
  // iso suffix 중복 방지: agodaSlug가 "-{iso-lower}" 또는 "-{iso-lower}-" 포함 시 그대로
  const isoLower = iso.toLowerCase();
  const hasIso = agodaSlug.includes(`-${isoLower}`);
  const citySegment = hasIso ? agodaSlug : `${agodaSlug}-${isoLower}`;
  const baseUrl = `https://www.agoda.com/ko-kr/city/${citySegment}.html`;

  const params: Record<string, string> = {
    utm_source: "otobz-trip",
    utm_medium: "affiliate",
    utm_campaign: "agoda",
    utm_content: "hotel-kr",
  };
  if (input.depart) params.checkIn = input.depart;
  if (input.return) params.checkOut = input.return;
  if (label) params.label = label;
  return appendParams(baseUrl, params);
}

/**
 * Booking.com fallback
 * https://www.booking.com/searchresults.ko.html?ss={city}&checkin=...&checkout=...
 */
export function hotelOutboundBooking(input: OutboundInput): string | null {
  const city = cityBySlug[input.slug];
  if (!city) return null;
  const cityEnSlug = city.cityEn.toLowerCase().replace(/\s+/g, "-");
  const campaign = `hotel-${cityEnSlug}-kr`;
  const label = tpLabel(campaign);

  const baseUrl = "https://www.booking.com/searchresults.ko.html";
  const params: Record<string, string> = {
    ss: city.cityEn,
    utm_source: "otobz-trip",
    utm_medium: "affiliate",
    utm_campaign: "booking",
    utm_content: "hotel-kr",
  };
  if (input.depart) params.checkin = input.depart;
  if (input.return) params.checkout = input.return;
  if (label) params.label = label;
  return appendParams(baseUrl, params);
}
