export type Region = "kr" | "jp" | "sea" | "us" | "eu" | "global";

const SEA = new Set(["TH", "VN", "SG", "MY", "ID", "PH", "KH", "LA", "MM", "BN"]);
const EU = new Set([
  "GB", "DE", "FR", "IT", "ES", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI",
  "IE", "PT", "GR", "CZ", "PL", "HU", "RO", "BG", "HR", "SK", "SI", "EE", "LV",
  "LT", "LU", "MT", "CY",
]);
const US_REGION = new Set(["US", "CA", "MX"]);

export function toRegion(country: string | null | undefined): Region {
  const c = (country ?? "").toUpperCase();
  if (c === "KR") return "kr";
  if (c === "JP") return "jp";
  if (SEA.has(c)) return "sea";
  if (US_REGION.has(c)) return "us";
  if (EU.has(c)) return "eu";
  return "global";
}

export function readGeoCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)tob_geo=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function regionFromCookie(): Region {
  return toRegion(readGeoCookie());
}

export function regionCurrency(region: Region): string {
  switch (region) {
    case "kr": return "KRW";
    case "jp": return "JPY";
    case "us": return "USD";
    case "eu": return "EUR";
    case "sea": return "USD";
    default: return "USD";
  }
}

export function regionLocale(region: Region): string {
  switch (region) {
    case "kr": return "ko-KR";
    case "jp": return "ja-JP";
    case "us": return "en-US";
    case "eu": return "en-GB";
    case "sea": return "en-US";
    default: return "en-US";
  }
}
