import { cityCountryMap } from "./city-country-map";

export interface Destination {
  slug: string;
  cityCode: string;
  cityKo: string;
  countryKo: string;
  description: string;
  keywords: string[];
}

export const destinations: Destination[] = [
  // 일본
  { slug: "tokyo", cityCode: "TYO", cityKo: "도쿄", countryKo: "일본", description: "일본의 수도 도쿄! 시부야, 아사쿠사, 아키하바라 등 볼거리가 가득한 도시의 항공권·숙소·투어 최저가를 확인하세요.", keywords: ["도쿄 항공권", "도쿄 숙소", "도쿄 여행", "도쿄 최저가", "일본 항공권"] },
  { slug: "osaka", cityCode: "KIX", cityKo: "오사카", countryKo: "일본", description: "먹거리 천국 오사카! 도톤보리, 오사카성, 유니버설 스튜디오까지. 오사카 항공권·숙소·투어 최저가를 비교하세요.", keywords: ["오사카 항공권", "오사카 숙소", "오사카 여행", "오사카 최저가"] },
  { slug: "fukuoka", cityCode: "FUK", cityKo: "후쿠오카", countryKo: "일본", description: "규슈의 관문 후쿠오카! 하카타 라멘, 텐진 쇼핑, 다자이후까지. 후쿠오카 항공권·숙소 최저가.", keywords: ["후쿠오카 항공권", "후쿠오카 여행", "후쿠오카 숙소"] },
  { slug: "sapporo", cityCode: "CTS", cityKo: "삿포로", countryKo: "일본", description: "홋카이도의 중심 삿포로! 눈축제, 온천, 해산물의 도시. 삿포로 항공권·숙소 최저가.", keywords: ["삿포로 항공권", "삿포로 여행", "홋카이도 항공권"] },
  { slug: "okinawa", cityCode: "OKA", cityKo: "오키나와", countryKo: "일본", description: "일본 속 열대 리조트 오키나와! 에메랄드빛 바다와 독특한 문화. 오키나와 항공권·숙소 최저가.", keywords: ["오키나와 항공권", "오키나와 여행", "오키나와 숙소"] },
  // 동남아
  { slug: "bangkok", cityCode: "BKK", cityKo: "방콕", countryKo: "태국", description: "태국의 수도 방콕! 왓프라깨우, 카오산로드, 짜뚜짝 시장까지. 방콕 항공권·숙소·투어 최저가.", keywords: ["방콕 항공권", "방콕 숙소", "방콕 여행", "태국 항공권"] },
  { slug: "danang", cityCode: "DAD", cityKo: "다낭", countryKo: "베트남", description: "베트남 중부의 해변 도시 다낭! 바나힐, 미케비치, 호이안까지. 다낭 항공권·숙소·투어 최저가.", keywords: ["다낭 항공권", "다낭 숙소", "다낭 여행", "베트남 항공권"] },
  { slug: "hanoi", cityCode: "HAN", cityKo: "하노이", countryKo: "베트남", description: "베트남의 수도 하노이! 호안끼엠 호수, 하롱베이, 쌀국수의 본고장. 하노이 항공권·숙소 최저가.", keywords: ["하노이 항공권", "하노이 여행", "하노이 숙소"] },
  { slug: "cebu", cityCode: "CEB", cityKo: "세부", countryKo: "필리핀", description: "필리핀 최고의 휴양지 세부! 오슬롭 고래상어, 카와산 폭포, 아일랜드 호핑. 세부 항공권·숙소 최저가.", keywords: ["세부 항공권", "세부 여행", "세부 숙소", "필리핀 항공권"] },
  { slug: "singapore", cityCode: "SIN", cityKo: "싱가포르", countryKo: "싱가포르", description: "아시아의 보석 싱가포르! 마리나베이샌즈, 가든스바이더베이, 센토사. 싱가포르 항공권·숙소 최저가.", keywords: ["싱가포르 항공권", "싱가포르 여행", "싱가포르 숙소"] },
  { slug: "bali", cityCode: "DPS", cityKo: "발리", countryKo: "인도네시아", description: "신들의 섬 발리! 우붓, 꾸따 비치, 울루와뚜 사원까지. 발리 항공권·숙소·투어 최저가.", keywords: ["발리 항공권", "발리 여행", "발리 숙소", "인도네시아 항공권"] },
  // 중화권
  { slug: "taipei", cityCode: "TPE", cityKo: "타이베이", countryKo: "대만", description: "대만의 수도 타이베이! 지우펀, 타이베이 101, 야시장 맛집 투어. 타이베이 항공권·숙소 최저가.", keywords: ["타이베이 항공권", "대만 항공권", "타이베이 여행", "대만 여행"] },
  { slug: "hongkong", cityCode: "HKG", cityKo: "홍콩", countryKo: "홍콩", description: "동양과 서양이 만나는 홍콩! 빅토리아 피크, 란콰이펑, 딤섬. 홍콩 항공권·숙소 최저가.", keywords: ["홍콩 항공권", "홍콩 여행", "홍콩 숙소"] },
  // 장거리
  { slug: "paris", cityCode: "PAR", cityKo: "파리", countryKo: "프랑스", description: "낭만의 도시 파리! 에펠탑, 루브르, 샹젤리제. 파리 항공권·숙소·투어 최저가.", keywords: ["파리 항공권", "파리 여행", "프랑스 항공권", "유럽 항공권"] },
  { slug: "london", cityCode: "LON", cityKo: "런던", countryKo: "영국", description: "대영제국의 수도 런던! 빅벤, 대영박물관, 타워브릿지. 런던 항공권·숙소 최저가.", keywords: ["런던 항공권", "런던 여행", "영국 항공권"] },
  { slug: "honolulu", cityCode: "HNL", cityKo: "호놀룰루", countryKo: "미국", description: "하와이의 심장 호놀룰루! 와이키키 비치, 다이아몬드 헤드. 호놀룰루 항공권·숙소 최저가.", keywords: ["하와이 항공권", "호놀룰루 항공권", "하와이 여행"] },
  { slug: "guam", cityCode: "GUM", cityKo: "괌", countryKo: "미국", description: "가까운 미국 괌! 투몬비치, 사랑의 절벽, 면세 쇼핑. 괌 항공권·숙소 최저가.", keywords: ["괌 항공권", "괌 여행", "괌 숙소", "괌 최저가"] },
  { slug: "sydney", cityCode: "SYD", cityKo: "시드니", countryKo: "호주", description: "호주의 상징 시드니! 오페라하우스, 하버브릿지, 본다이비치. 시드니 항공권·숙소 최저가.", keywords: ["시드니 항공권", "호주 항공권", "시드니 여행"] },
];

export const destinationBySlug = Object.fromEntries(
  destinations.map((d) => [d.slug, d])
);
