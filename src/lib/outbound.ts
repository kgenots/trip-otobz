import { cityBySlug } from "@/data/cities";

const TP_MARKER = process.env.NEXT_PUBLIC_TP_MARKER || "";

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
    utm_source: "trip-otobz",
    utm_medium: "affiliate",
    utm_campaign: "skyscanner",
    utm_content: "flight-kr",
  };
  if (label) params.label = label;
  return appendParams(url, params);
}

/**
 * Agoda 호텔 검색
 * https://www.agoda.com/ko-kr/search?q={city}&checkIn=...&checkOut=...
 */
export function hotelOutbound(input: OutboundInput): string | null {
  const city = cityBySlug[input.slug];
  if (!city) return null;
  const cityEnSlug = city.cityEn.toLowerCase().replace(/\s+/g, "-");
  const campaign = `hotel-${cityEnSlug}-kr`;
  const label = tpLabel(campaign);

  const baseUrl = "https://www.agoda.com/ko-kr/search";
  const params: Record<string, string> = {
    q: city.cityEn,
    utm_source: "trip-otobz",
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
    utm_source: "trip-otobz",
    utm_medium: "affiliate",
    utm_campaign: "booking",
    utm_content: "hotel-kr",
  };
  if (input.depart) params.checkin = input.depart;
  if (input.return) params.checkout = input.return;
  if (label) params.label = label;
  return appendParams(baseUrl, params);
}
