/**
 * 쿠팡 파트너스 어필리에이트 헬퍼.
 *
 * 사용 흐름:
 * 1. marketer agent 가 blog 본문에 [AFFILIATE:tag] 토큰 삽입
 *    예) [AFFILIATE:luggage-20inch]  [AFFILIATE:esim-japan]
 * 2. markdown 렌더 단계에서 resolveCoupangToken() 으로 치환
 * 3. 검색 기반 링크 (특정 상품 ID 없어도 수수료 집계됨)
 *
 * 쿠팡 파트너스 공식:
 *   https://partners.coupang.com/
 *   검색 URL 형식: https://www.coupang.com/np/search?q={keyword}&channel=auto&lptag=AF{partnerId}
 */

const PARTNER_ID =
  process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID ||
  process.env.COUPANG_PARTNER_ID ||
  "";

if (typeof window === "undefined" && !PARTNER_ID) {
  console.warn(
    "[coupang] PARTNER_ID 미설정 — affiliate 박스 클릭 시 lptag 없는 URL 생성 (트래킹 누락). " +
      "Infisical /worker/coupang/COUPANG_PARTNER_ID 또는 NEXT_PUBLIC_COUPANG_PARTNER_ID env 확인 필요.",
  );
}

const BASE_SEARCH = "https://www.coupang.com/np/search";

export function coupangSearchUrl(keyword: string, utmContent?: string): string {
  const q = encodeURIComponent(keyword);
  let url = `${BASE_SEARCH}?q=${q}&channel=auto`;
  if (PARTNER_ID) {
    const lptag = PARTNER_ID.startsWith("AF") ? PARTNER_ID : `AF${PARTNER_ID}`;
    url += `&lptag=${lptag}`;
  }
  if (utmContent) url += `&utm_content=${encodeURIComponent(utmContent)}`;
  return url;
}

// 정적 태그 → 쿠팡 검색 키워드 매핑
const STATIC_TAGS: Record<string, string> = {
  "luggage-20inch": "20인치 기내용 캐리어",
  "luggage-24inch": "24인치 여행 캐리어",
  "luggage-28inch": "28인치 대형 캐리어",
  "luggage-set": "캐리어 3종 세트",
  "backpack-travel": "여행용 백팩 40L",
  "packing-cube": "여행 파우치 세트",
  "esim-global": "해외 eSIM 데이터",
  "esim-pocket-wifi": "해외 포켓 와이파이",
  "powerbank-10000": "보조배터리 10000mAh",
  "powerbank-20000": "보조배터리 20000mAh",
  "powerbank-mag": "맥세이프 보조배터리",
  "power-adapter-universal": "멀티 변환 플러그 110v 220v",
  "travel-insurance": "해외여행자보험",
  "neck-pillow": "여행용 목베개",
  "eye-mask": "수면 안대 여행용",
  "slipper-travel": "여행용 슬리퍼",
  "action-camera": "액션캠 방수",
  "mini-tripod": "미니 삼각대 여행용",
  "camera-memory": "메모리카드 128GB",
  "travel-organizer": "여권 지갑",
  "luggage-scale": "여행용 전자 저울",
  "travel-pillow-footrest": "비행기 발받침",
  "compression-socks": "압박 스타킹 비행기",
};

// 동적 태그 (국가·도시 변수 포함)
function resolveDynamic(tag: string): string | null {
  // esim-<country>  → eSIM <country>
  const esim = tag.match(/^esim-(.+)$/);
  if (esim) {
    const country = esim[1].replace(/-/g, " ");
    return country + " eSIM 데이터";
  }
  // power-adapter-<country>  → <country> 변환 플러그
  const adapter = tag.match(/^power-adapter-(.+)$/);
  if (adapter) {
    const country = adapter[1].replace(/-/g, " ");
    return country + " 여행 변환 플러그";
  }
  // guidebook-<city>  → <city> 가이드북
  const guide = tag.match(/^guidebook-(.+)$/);
  if (guide) {
    const city = guide[1].replace(/-/g, " ");
    return city + " 여행 가이드북";
  }
  // sim-<country>  → <country> SIM
  const sim = tag.match(/^sim-(.+)$/);
  if (sim) {
    const country = sim[1].replace(/-/g, " ");
    return country + " 여행 SIM 카드";
  }
  return null;
}

export function resolveCoupangToken(tag: string): string | null {
  const kw = STATIC_TAGS[tag] || resolveDynamic(tag);
  if (!kw) return null;
  return coupangSearchUrl(kw, `affiliate-${tag}`);
}

const TOKEN_RE = /\[AFFILIATE:([a-z0-9-]+)\]/gi;

/**
 * markdown content 내 [AFFILIATE:tag] 토큰을 쿠팡 링크로 치환.
 * 치환되지 않은 (알 수 없는) tag 는 원본 유지.
 */
export function replaceAffiliateTokens(content: string): string {
  return content.replace(TOKEN_RE, (match, tag) => {
    const url = resolveCoupangToken(String(tag));
    return url ? `[👉 쿠팡 보기](${url})` : match;
  });
}

export function hasCoupangLink(content: string): boolean {
  return /coupang\.com/i.test(content) || TOKEN_RE.test(content);
}

export const COUPANG_DISCLAIMER =
  "*본 포스트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.*";
