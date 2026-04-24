import { cityBySlug } from "@/data/cities";
import { SLUG_ISO } from "@/lib/slug-iso";
import { buildUrl, type AffiliateCtx, type Product } from "@/lib/affiliate-global";

export type OutboundInput = {
  slug: string;
  product?: Product; // default: flight
  depart?: string; // YYYY-MM-DD
  return?: string; // YYYY-MM-DD
};

function injectFlightDates(url: string, input: OutboundInput): string {
  if (!input.depart && !input.return) return url;
  try {
    const u = new URL(url);
    const host = u.hostname;
    if (host.includes("skyscanner")) {
      // skyscanner uses yymmdd
      const fmt = (d: string) => d.replace(/-/g, "").slice(2);
      if (input.depart) u.searchParams.set("outboundpartialdate", fmt(input.depart));
      if (input.return) u.searchParams.set("inboundpartialdate", fmt(input.return));
    } else if (host.includes("trip.com")) {
      if (input.depart) u.searchParams.set("depdate", input.depart);
      if (input.return) u.searchParams.set("retdate", input.return);
    } else if (host.includes("kayak")) {
      if (input.depart) u.searchParams.set("depart", input.depart);
      if (input.return) u.searchParams.set("return", input.return);
    }
    return u.toString();
  } catch {
    return url;
  }
}

function injectHotelDates(url: string, input: OutboundInput): string {
  if (!input.depart && !input.return) return url;
  try {
    const u = new URL(url);
    const host = u.hostname;
    if (host.includes("agoda")) {
      if (input.depart) u.searchParams.set("checkIn", input.depart);
      if (input.return) u.searchParams.set("checkOut", input.return);
    } else if (host.includes("booking")) {
      if (input.depart) u.searchParams.set("checkin", input.depart);
      if (input.return) u.searchParams.set("checkout", input.return);
    } else if (host.includes("trip.com")) {
      if (input.depart) u.searchParams.set("checkin", input.depart);
      if (input.return) u.searchParams.set("checkout", input.return);
    }
    return u.toString();
  } catch {
    return url;
  }
}

export function flightOutbound(input: OutboundInput): string | null {
  const city = cityBySlug[input.slug];
  if (!city) return null;
  const iso = SLUG_ISO[input.slug] ?? "";
  const ctx: AffiliateCtx = {
    cityEn: city.cityEn,
    cityKo: city.cityKo,
    countryIso: iso,
    region: "kr", // 한국 출발 타겟 persona 고정
    product: "flight",
  };
  const url = buildUrl("skyscanner", ctx);
  return injectFlightDates(url, input);
}

export function hotelOutbound(input: OutboundInput): string | null {
  const city = cityBySlug[input.slug];
  if (!city) return null;
  const iso = SLUG_ISO[input.slug] ?? "";
  const ctx: AffiliateCtx = {
    cityEn: city.cityEn,
    cityKo: city.cityKo,
    countryIso: iso,
    region: "kr",
    product: "hotel",
  };
  const url = buildUrl("agoda", ctx);
  return injectHotelDates(url, input);
}
