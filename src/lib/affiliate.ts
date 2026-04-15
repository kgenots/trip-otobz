/**
 * 클라이언트용 어필리에이트 링크 유틸
 * mylinkId는 /api/config에서 런타임으로 가져옴
 */

let _mylinkId = "";
let _fetched = false;

export async function getMylinkId(): Promise<string> {
  if (_fetched) return _mylinkId;
  try {
    const res = await fetch("/api/config");
    const data = await res.json();
    _mylinkId = data.mylinkId || "";
  } catch {
    _mylinkId = "";
  }
  _fetched = true;
  return _mylinkId;
}

export function appendAffiliate(
  baseUrl: string,
  mylinkId: string,
  utmContent?: string
): string {
  if (!mylinkId) return baseUrl;
  const url = new URL(baseUrl);
  url.searchParams.set("mylink_id", mylinkId);
  if (utmContent) {
    url.searchParams.set("utm_content", utmContent);
  }
  return url.toString();
}

export function accommodationUrl(mylinkId: string, itemId: number): string {
  return appendAffiliate(
    `https://www.myrealtrip.com/accommodations/${itemId}`,
    mylinkId,
    "accommodation"
  );
}

export function tourUrl(mylinkId: string, productUrl: string): string {
  return appendAffiliate(productUrl, mylinkId, "tour");
}

// Klook 어필리에이트
const KLOOK_AID = "118698";

export function klookSearchUrl(cityKo: string): string {
  return `https://www.klook.com/ko/search/?query=${encodeURIComponent(cityKo)}&aid=${KLOOK_AID}&utm_medium=affiliate&utm_source=trip-otobz&utm_campaign=${KLOOK_AID}`;
}

export function klookCityUrl(cityEn: string): string {
  const slug = cityEn.toLowerCase().replace(/\s+/g, "-");
  return `https://www.klook.com/ko/city/${slug}/?aid=${KLOOK_AID}&utm_medium=affiliate&utm_source=trip-otobz&utm_campaign=${KLOOK_AID}`;
}

// ── 서버사이드 빌더 (DB 저장 시 사용) ──

export function buildMrtAffiliateUrl(productUrl: string): string {
  const mylinkId = process.env.MYLINK_ID;
  if (!mylinkId) return productUrl;
  try {
    const url = new URL(productUrl);
    url.searchParams.set("mylink_id", mylinkId);
    url.searchParams.set("utm_content", "tour");
    url.searchParams.set("utm_source", "trip-otobz");
    return url.toString();
  } catch {
    return productUrl;
  }
}

export function buildKlookAffiliateUrl(originalUrl: string): string {
  try {
    const url = new URL(originalUrl);
    url.searchParams.set("aid", KLOOK_AID);
    url.searchParams.set("utm_medium", "affiliate");
    url.searchParams.set("utm_source", "trip-otobz");
    url.searchParams.set("utm_campaign", KLOOK_AID);
    return url.toString();
  } catch {
    return originalUrl;
  }
}
