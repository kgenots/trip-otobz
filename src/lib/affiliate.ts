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
 * depctynm/arrctynm (도시 한글 이름) 필수
 */
export function flightUrl(
  mylinkId: string,
  params: {
    depCityCd?: string;
    depCityNm?: string;
    arrCityCd: string;
    arrCityNm?: string;
    departureDate?: string;
    returnDate?: string;
  }
): string {
  const dep = params.depCityCd || "SEL";
  const depNm = params.depCityNm || "서울";
  const arr = params.arrCityCd;
  const arrNm = params.arrCityNm || arr;
  const isRoundTrip = !!params.returnDate;

  const base =
    "https://flights.myrealtrip.com/air/b2c/AIR/INT/AIRINTSCH0100100010.k1";

  const p = new URLSearchParams();
  p.append("initform", isRoundTrip ? "RT" : "OW");
  p.append("domintgubun", "I");
  // 구간별 출발/도착 도시
  p.append("depctycd", dep);
  if (isRoundTrip) p.append("depctycd", arr);
  p.append("depctynm", depNm);
  if (isRoundTrip) p.append("depctynm", arrNm);
  p.append("arrctycd", arr);
  if (isRoundTrip) p.append("arrctycd", dep);
  p.append("arrctynm", arrNm);
  if (isRoundTrip) p.append("arrctynm", depNm);
  // 날짜
  if (params.departureDate) p.append("depdt", params.departureDate);
  if (params.returnDate) p.append("depdt", params.returnDate);
  // 승객/좌석
  p.append("adtcount", "1");
  p.append("chdcount", "0");
  p.append("infcount", "0");
  p.append("cabinclass", "Y");
  p.append("secrchType", "FARE");
  p.append("availcount", "250");
  // 어필리에이트
  if (mylinkId) {
    p.append("mylink_id", mylinkId);
    p.append("utm_content", "flight");
  }

  return `${base}?${p.toString()}`;
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
