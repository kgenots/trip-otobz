import type { Region } from "./region";

export type Product = "hotel" | "tour" | "flight" | "activity";

export type AffiliateProvider =
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

// Awin affiliate network (wraps Booking.com + other Awin-enabled merchants)
const AWIN = {
  publisherId: process.env.NEXT_PUBLIC_AWIN_PUBLISHER_ID || "",
  midBooking: process.env.NEXT_PUBLIC_AWIN_MID_BOOKING || "",
  midAgoda: process.env.NEXT_PUBLIC_AWIN_MID_AGODA || "",
  midHotels: process.env.NEXT_PUBLIC_AWIN_MID_HOTELS || "",
};

function wrapAwin(mid: string, deeplink: string, clickref = ""): string {
  if (!AWIN.publisherId || !mid) return deeplink;
  const p = encodeURIComponent(deeplink);
  const ref = encodeURIComponent(clickref);
  return `https://www.awin1.com/cread.php?awinmid=${mid}&awinaffid=${AWIN.publisherId}&clickref=${ref}&p=${p}`;
}

const UTM = (region: Region, p: AffiliateProvider, product: Product) =>
  `utm_source=trip-otobz&utm_medium=affiliate&utm_campaign=${p}&utm_content=${product}-${region}`;

export const CHAIN: Record<Region, Record<Product, AffiliateProvider[]>> = {
  kr:     { hotel: ["agoda", "booking"],            tour: ["klook", "kkday"],          flight: ["skyscanner", "tripcom"],  activity: ["klook", "kkday"] },
  jp:     { hotel: ["agoda", "rakuten", "booking"], tour: ["kkday", "klook", "viator"],flight: ["skyscanner"],              activity: ["kkday", "klook"] },
  sea:    { hotel: ["agoda", "booking"],            tour: ["klook", "viator"],         flight: ["tripcom", "skyscanner"],  activity: ["klook", "viator"] },
  us:     { hotel: ["booking", "expedia", "hotels"],tour: ["viator", "getyourguide"],  flight: ["skyscanner", "kayak"],    activity: ["viator", "getyourguide"] },
  eu:     { hotel: ["booking", "agoda"],            tour: ["getyourguide", "viator"],  flight: ["skyscanner", "kayak"],    activity: ["getyourguide", "viator"] },
  global: { hotel: ["booking", "agoda"],            tour: ["viator", "klook"],         flight: ["skyscanner"],              activity: ["viator", "klook"] },
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
    case "klook": {
      const url = ctx.product === "flight"
        ? `https://www.klook.com/search/?query=${encodeURIComponent(ctx.cityEn + " flight")}`
        : `https://www.klook.com/city/${cityEnSlug}/`;
      return ensure(url, { aid: AIDS.klook }) + `&${utm}`;
    }
    case "agoda": {
      const direct = `https://www.agoda.com/search?city=${encodeURIComponent(ctx.cityEn)}`;
      if (AWIN.publisherId && AWIN.midAgoda) {
        const deeplink = `${direct}&${utm}`;
        return wrapAwin(AWIN.midAgoda, deeplink, `city-${cityEnSlug}-${ctx.region}`);
      }
      if (AIDS.agoda) {
        return ensure(direct, { cid: AIDS.agoda }) + `&${utm}`;
      }
      return direct + `&${utm}`;
    }
    case "booking": {
      const direct = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(ctx.cityEn)}`;
      // 1) Awin 래핑 우선 (publisherId + MID 있으면)
      if (AWIN.publisherId && AWIN.midBooking) {
        const deeplink = `${direct}&${utm}`;
        return wrapAwin(AWIN.midBooking, deeplink, `city-${cityEnSlug}-${ctx.region}`);
      }
      // 2) Booking 직접 aid 파라미터 (별도 가입 시)
      if (AIDS.booking) {
        return ensure(direct, { aid: AIDS.booking }) + `&${utm}`;
      }
      // 3) Fallback: UTM만
      return direct + `&${utm}`;
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
        ? `https://www.trip.com/flights/showfarefirst?dcity=&acity=${encodeURIComponent(ctx.cityEn)}`
        : `https://www.trip.com/hotels/list?city=${encodeURIComponent(ctx.cityEn)}`;
      return AIDS.tripcom
        ? url + `&AID=${AIDS.tripcom}&${utm}`
        : url + `&${utm}`;
    }
    case "skyscanner": {
      const url = `https://www.skyscanner.net/flights-to/${cityEnSlug}/`;
      return AIDS.skyscanner
        ? url + `?associateid=${AIDS.skyscanner}&${utm}`
        : url + `?${utm}`;
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
