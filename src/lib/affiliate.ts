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
 * 정상 작동하는 마이리얼트립 URL 형식을 완벽 재현
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
  const dep = params.depCityCd || "ICN";
  const depNm = params.depCityNm || "인천";
  const arr = params.arrCityCd;
  const arrNm = params.arrCityNm || arr;
  const isRoundTrip = !!params.returnDate;

  const base =
    "https://flights.myrealtrip.com/air/b2c/AIR/INT/AIRINTSCH0100100010.k1";

  // 마이리얼트립은 4슬롯 형식 (다구간 지원), 빈 슬롯도 포함해야 함
  const p = new URLSearchParams();
  p.append("initform", isRoundTrip ? "RT" : "OW");
  p.append("domintgubun", "I");
  // depctycd 4슬롯
  p.append("depctycd", dep);
  p.append("depctycd", isRoundTrip ? arr : "");
  p.append("depctycd", "");
  p.append("depctycd", "");
  // arrctycd 4슬롯
  p.append("arrctycd", arr);
  p.append("arrctycd", isRoundTrip ? dep : "");
  p.append("arrctycd", "");
  p.append("arrctycd", "");
  // depctynm 4슬롯
  p.append("depctynm", depNm);
  p.append("depctynm", isRoundTrip ? arrNm : "");
  p.append("depctynm", "");
  p.append("depctynm", "");
  // arrctynm 4슬롯
  p.append("arrctynm", arrNm);
  p.append("arrctynm", isRoundTrip ? depNm : "");
  p.append("arrctynm", "");
  p.append("arrctynm", "");
  // depdt 4슬롯
  p.append("depdt", params.departureDate || "");
  p.append("depdt", params.returnDate || "");
  p.append("depdt", "");
  p.append("depdt", "");
  // 승객/좌석
  p.append("adtcount", "1");
  p.append("chdcount", "0");
  p.append("infcount", "0");
  p.append("cabinclass", "Y");
  p.append("preferaircd", "");
  p.append("availcount", "250");
  // 필수 추가 파라미터
  p.append("opencase", "N");
  p.append("opencase", "N");
  p.append("opencase", "N");
  p.append("openday", "");
  p.append("openday", "");
  p.append("openday", "");
  p.append("depdomintgbn", "D");
  p.append("tasktype", "B2C");
  p.append("secrchType", "FARE");
  p.append("maxprice", "");
  p.append("servicecacheyn", "Y");
  p.append("nonstop", "N");
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
