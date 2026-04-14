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

/**
 * 마이리얼트립 항공권 검색 결과 URL 생성
 * 실제 검색 결과 페이지로 연결 (AIRINTSCH0100100010.k1)
 */
export function flightUrl(
  mylinkId: string,
  params: {
    depCityCd?: string;
    arrCityCd: string;
    departureDate?: string;
    returnDate?: string;
  }
): string {
  const dep = params.depCityCd || "SEL";
  const arr = params.arrCityCd;
  const isRoundTrip = !!params.returnDate;

  const url = new URL(
    "https://flights.myrealtrip.com/air/b2c/AIR/INT/AIRINTSCH0100100010.k1"
  );
  url.searchParams.append("initform", isRoundTrip ? "RT" : "OW");
  url.searchParams.append("domintgubun", "I");
  url.searchParams.append("depctycd", dep);
  if (isRoundTrip) url.searchParams.append("depctycd", arr);
  url.searchParams.append("arrctycd", arr);
  if (isRoundTrip) url.searchParams.append("arrctycd", dep);
  if (params.departureDate) url.searchParams.append("depdt", params.departureDate);
  if (params.returnDate) url.searchParams.append("depdt", params.returnDate);
  url.searchParams.append("adtcount", "1");
  url.searchParams.append("chdcount", "0");
  url.searchParams.append("infcount", "0");
  url.searchParams.append("cabinclass", "Y");
  url.searchParams.append("secrchType", "FARE");
  url.searchParams.append("availcount", "250");

  return appendAffiliate(url.toString(), mylinkId, "flight");
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
