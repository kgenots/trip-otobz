import type { Region } from "./region";

export type Product = "hotel" | "tour" | "flight" | "activity";

export type AffiliateProvider =
  | "hotellook" | "aviasales"
  | "agoda" | "booking" | "hotels" | "expedia" | "rakuten"
  | "klook" | "kkday" | "getyourguide" | "viator" | "tripcom"
  | "skyscanner" | "kayak";

const AIDS = {
  klook: process.env.NEXT_PUBLIC_AID_KLOOK || "118698",
  agoda: process.env.NEXT_PUBLIC_AID_AGODA || "",
  booking: process.env.NEXT_PUBLIC_AID_BOOKING || "",
  hotels: process.env.NEXT_PUBLIC_AID_HOTELS || "",
  expedia: process.env.NEXT_PUBLIC_AID_EXPEDIA || "",
  rakuten: process.env.NEXT_PUBLIC_AID_RAKUTEN || "",
  kkday: process.env.NEXT_PUBLIC_AID_KKDAY || "",
  getyourguide: process.env.NEXT_PUBLIC_AID_GYG || "",
  viator: process.env.NEXT_PUBLIC_AID_VIATOR || "",
  tripcom: process.env.NEXT_PUBLIC_AID_TRIPCOM || "",
  skyscanner: process.env.NEXT_PUBLIC_AID_SKYSCANNER || "",
  kayak: process.env.NEXT_PUBLIC_AID_KAYAK || "",
};

// Travelpayouts 통합 네트워크 (Booking/Agoda/Skyscanner/Trip.com 일원화)
// Passive 트래커(<head> 스크립트)가 클릭 자동 캡처 + 명시 deeplink로 이중 방어
const TP = {
  // 721495 = otobz-trip Travelpayouts marker (이미 블로그 esim 링크에 사용 중)
  marker: process.env.NEXT_PUBLIC_TP_MARKER || "721495",
  // Travelpayouts 내부 program IDs (https://www.travelpayouts.com/ dashboard > Programs)
  // 미설정 시 tp.media 래핑 건너뛰고 직접 URL + label 파라미터만 사용 (트래커가 캡처)
  pBooking: process.env.NEXT_PUBLIC_TP_P_BOOKING || "",
  pAgoda: process.env.NEXT_PUBLIC_TP_P_AGODA || "",
  pSkyscanner: process.env.NEXT_PUBLIC_TP_P_SKYSCANNER || "",
  pTripcom: process.env.NEXT_PUBLIC_TP_P_TRIPCOM || "",
  pHotellook: process.env.NEXT_PUBLIC_TP_P_HOTELLOOK || "",
  pAiralo: process.env.NEXT_PUBLIC_TP_P_AIRALO || "",
};

// tp.media redirector 래퍼 — program ID 있을 때만
function wrapTP(programId: string, deeplink: string, campaign: string): string {
  if (!TP.marker || !programId) return deeplink;
  const u = encodeURIComponent(deeplink);
  const trs = encodeURIComponent(campaign);
  return `https://tp.media/r?marker=${TP.marker}&trs=${trs}&p=${programId}&u=${u}&campaign_id=100`;
}

// 직접 URL + TP label (passive 트래커용 fallback)
function appendTPLabel(url: string, campaign: string): string {
  if (!TP.marker) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("label", `tp-${TP.marker}-${campaign}`);
    return u.toString();
  } catch {
    return url;
  }
}

const UTM = (region: Region, p: AffiliateProvider, product: Product) =>
  `utm_source=otobz-trip&utm_medium=affiliate&utm_campaign=${p}&utm_content=${product}-${region}`;

// Single-gate TP integration for hotel/flight (Hotellook & Aviasales are TP-owned,
// commission tracked via marker only — no per-program approval needed).
// Tour/activity keep direct AIDs (Klook/KKday/Viator/GYG).
export const CHAIN: Record<Region, Record<Product, AffiliateProvider[]>> = {
  kr:     { hotel: ["hotellook"], tour: ["klook", "kkday"],         flight: ["aviasales"], activity: ["klook", "kkday"] },
  jp:     { hotel: ["hotellook"], tour: ["kkday", "klook", "viator"], flight: ["aviasales"], activity: ["kkday", "klook"] },
  sea:    { hotel: ["hotellook"], tour: ["klook", "viator"],         flight: ["aviasales"], activity: ["klook", "viator"] },
  us:     { hotel: ["hotellook"], tour: ["viator", "getyourguide"],  flight: ["aviasales"], activity: ["viator", "getyourguide"] },
  eu:     { hotel: ["hotellook"], tour: ["getyourguide", "viator"],  flight: ["aviasales"], activity: ["getyourguide", "viator"] },
  global: { hotel: ["hotellook"], tour: ["viator", "klook"],         flight: ["aviasales"], activity: ["viator", "klook"] },
};

export interface AffiliateCtx {
  cityEn: string;
  cityKo: string;
  countryIso?: string;
  region: Region;
  product: Product;
}

function ensure(url: string, kv: Record<string, string>): string {
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(kv)) u.searchParams.set(k, v);
    return u.toString();
  } catch {
    return url;
  }
}

export function buildUrl(provider: AffiliateProvider, ctx: AffiliateCtx): string {
  const cityEnSlug = ctx.cityEn.toLowerCase().replace(/\s+/g, "-");
  const utm = UTM(ctx.region, provider, ctx.product);

  switch (provider) {
    case "hotellook": {
      // TP-owned hotel meta-search. Marker alone is enough — no program approval needed.
      const url = `https://search.hotellook.com/?destination=${encodeURIComponent(ctx.cityEn)}`;
      const params: Record<string, string> = {};
      if (TP.marker) params.marker = TP.marker;
      const campaign = `city-${cityEnSlug}-${ctx.region}`;
      params.sub_id = campaign;
      return ensure(url, params) + `&${utm}`;
    }
    case "aviasales": {
      // TP-owned flight meta-search. Marker alone is enough.
      const url = `https://www.aviasales.com/search?destination=${encodeURIComponent(ctx.cityEn)}`;
      const params: Record<string, string> = {};
      if (TP.marker) params.marker = TP.marker;
      const campaign = `city-${cityEnSlug}-${ctx.region}`;
      params.sub_id = campaign;
      return ensure(url, params) + `&${utm}`;
    }
    case "klook": {
      const url = ctx.product === "flight"
        ? `https://www.klook.com/search/?query=${encodeURIComponent(ctx.cityEn + " flight")}`
        : `https://www.klook.com/city/${cityEnSlug}/`;
      return ensure(url, { aid: AIDS.klook }) + `&${utm}`;
    }
    case "agoda": {
      const direct = `https://www.agoda.com/search?city=${encodeURIComponent(ctx.cityEn)}`;
      const deeplink = `${direct}&${utm}`;
      const campaign = `city-${cityEnSlug}-${ctx.region}`;
      // 1) Travelpayouts 우선 — program ID 있으면 tp.media 래핑
      if (TP.marker && TP.pAgoda) {
        return wrapTP(TP.pAgoda, deeplink, campaign);
      }
      // 2) TP 트래커 passive 캡처용 label 추가
      if (TP.marker) {
        return appendTPLabel(deeplink, campaign);
      }
      // 3) 직접 AID (TP 미설정 시)
      if (AIDS.agoda) {
        return ensure(direct, { cid: AIDS.agoda }) + `&${utm}`;
      }
      return deeplink;
    }
    case "booking": {
      const direct = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(ctx.cityEn)}`;
      const deeplink = `${direct}&${utm}`;
      const campaign = `city-${cityEnSlug}-${ctx.region}`;
      // 1) Travelpayouts 우선 — program ID 있으면 tp.media 래핑 (승인 완료 후)
      if (TP.marker && TP.pBooking) {
        return wrapTP(TP.pBooking, deeplink, campaign);
      }
      // 2) TP 트래커 passive 캡처용 label 추가 (검토 중에도 작동)
      if (TP.marker) {
        return appendTPLabel(deeplink, campaign);
      }
      // 3) 직접 aid (TP 미설정 시)
      if (AIDS.booking) {
        return ensure(direct, { aid: AIDS.booking }) + `&${utm}`;
      }
      return deeplink;
    }
    case "hotels": {
      const url = `https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(ctx.cityEn)}`;
      return AIDS.hotels
        ? url + `&siteid=${AIDS.hotels}&${utm}`
        : url + `&${utm}`;
    }
    case "expedia": {
      const url = `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(ctx.cityEn)}`;
      return AIDS.expedia
        ? url + `&clickref=${AIDS.expedia}&${utm}`
        : url + `&${utm}`;
    }
    case "rakuten": {
      const url = `https://travel.rakuten.co.jp/search/${encodeURIComponent(ctx.cityEn)}/`;
      return AIDS.rakuten
        ? url + `?scid=${AIDS.rakuten}&${utm}`
        : url + `?${utm}`;
    }
    case "kkday": {
      const url = `https://www.kkday.com/en/search/cities/${cityEnSlug}`;
      return AIDS.kkday
        ? url + `?cid=${AIDS.kkday}&${utm}`
        : url + `?${utm}`;
    }
    case "getyourguide": {
      const url = `https://www.getyourguide.com/s?q=${encodeURIComponent(ctx.cityEn)}`;
      return AIDS.getyourguide
        ? url + `&partner_id=${AIDS.getyourguide}&${utm}`
        : url + `&${utm}`;
    }
    case "viator": {
      const url = `https://www.viator.com/searchResults/all?text=${encodeURIComponent(ctx.cityEn)}`;
      return AIDS.viator
        ? url + `&pid=${AIDS.viator}&${utm}`
        : url + `&${utm}`;
    }
    case "tripcom": {
      const url = ctx.product === "flight"
        ? `https://www.trip.com/flights/showfarefirst?dcity=icn&acity=${encodeURIComponent(ctx.cityEn)}`
        : `https://www.trip.com/hotels/list?city=${encodeURIComponent(ctx.cityEn)}`;
      const deeplink = `${url}&${utm}`;
      const campaign = `city-${cityEnSlug}-${ctx.region}`;
      if (TP.marker && TP.pTripcom) {
        return wrapTP(TP.pTripcom, deeplink, campaign);
      }
      if (TP.marker) {
        return appendTPLabel(deeplink, campaign);
      }
      if (AIDS.tripcom) {
        return url + `&AID=${AIDS.tripcom}&${utm}`;
      }
      return deeplink;
    }
    case "skyscanner": {
      const url = `https://www.skyscanner.net/flights-to/${cityEnSlug}/`;
      const deeplink = `${url}?${utm}`;
      const campaign = `city-${cityEnSlug}-${ctx.region}`;
      // 1) Travelpayouts 우선 (Skyscanner 공식 파트너)
      if (TP.marker && TP.pSkyscanner) {
        return wrapTP(TP.pSkyscanner, deeplink, campaign);
      }
      if (TP.marker) {
        return appendTPLabel(deeplink, campaign);
      }
      if (AIDS.skyscanner) {
        return url + `?associateid=${AIDS.skyscanner}&${utm}`;
      }
      return deeplink;
    }
    case "kayak": {
      const url = `https://www.kayak.com/flights?destination=${encodeURIComponent(ctx.cityEn)}`;
      return url + `&${utm}`;
    }
  }
}

export function bestProviders(
  region: Region,
  product: Product,
  limit = 2
): AffiliateProvider[] {
  return CHAIN[region][product].slice(0, limit);
}

export const PROVIDER_LABEL: Record<AffiliateProvider, string> = {
  hotellook: "호텔 비교",
  aviasales: "항공권 비교",
  agoda: "Agoda",
  booking: "Booking.com",
  hotels: "Hotels.com",
  expedia: "Expedia",
  rakuten: "Rakuten Travel",
  klook: "Klook",
  kkday: "KKday",
  getyourguide: "GetYourGuide",
  viator: "Viator",
  tripcom: "Trip.com",
  skyscanner: "Skyscanner",
  kayak: "Kayak",
};
