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
