export interface City {
  slug: string;
  cityKo: string;
  cityEn: string;
  countryKo: string;
  emoji: string;
  lat: number;
  lng: number;
}

export const cities: City[] = [
  // 일본
  { slug: "tokyo", cityKo: "도쿄", cityEn: "Tokyo", countryKo: "일본", emoji: "🇯🇵", lat: 35.6762, lng: 139.6503 },
  { slug: "osaka", cityKo: "오사카", cityEn: "Osaka", countryKo: "일본", emoji: "🇯🇵", lat: 34.6937, lng: 135.5023 },
  { slug: "kyoto", cityKo: "교토", cityEn: "Kyoto", countryKo: "일본", emoji: "🇯🇵", lat: 35.0116, lng: 135.7681 },
  { slug: "fukuoka", cityKo: "후쿠오카", cityEn: "Fukuoka", countryKo: "일본", emoji: "🇯🇵", lat: 33.5904, lng: 130.4017 },
  { slug: "sapporo", cityKo: "삿포로", cityEn: "Sapporo", countryKo: "일본", emoji: "🇯🇵", lat: 43.0618, lng: 141.3545 },
  // 태국
  { slug: "bangkok", cityKo: "방콕", cityEn: "Bangkok", countryKo: "태국", emoji: "🇹🇭", lat: 13.7563, lng: 100.5018 },
  { slug: "chiangmai", cityKo: "치앙마이", cityEn: "Chiang Mai", countryKo: "태국", emoji: "🇹🇭", lat: 18.7883, lng: 98.9853 },
  { slug: "phuket", cityKo: "푸켓", cityEn: "Phuket", countryKo: "태국", emoji: "🇹🇭", lat: 7.8804, lng: 98.3923 },
  // 베트남
  { slug: "hochiminh", cityKo: "호치민", cityEn: "Ho Chi Minh", countryKo: "베트남", emoji: "🇻🇳", lat: 10.8231, lng: 106.6297 },
  { slug: "hanoi", cityKo: "하노이", cityEn: "Hanoi", countryKo: "베트남", emoji: "🇻🇳", lat: 21.0278, lng: 105.8342 },
  { slug: "danang", cityKo: "다낭", cityEn: "Da Nang", countryKo: "베트남", emoji: "🇻🇳", lat: 16.0544, lng: 108.2022 },
  // 동남아 기타
  { slug: "singapore", cityKo: "싱가포르", cityEn: "Singapore", countryKo: "싱가포르", emoji: "🇸🇬", lat: 1.3521, lng: 103.8198 },
  { slug: "bali", cityKo: "발리", cityEn: "Bali", countryKo: "인도네시아", emoji: "🇮🇩", lat: -8.3405, lng: 115.092 },
  { slug: "cebu", cityKo: "세부", cityEn: "Cebu", countryKo: "필리핀", emoji: "🇵🇭", lat: 10.3157, lng: 123.8854 },
  { slug: "manila", cityKo: "마닐라", cityEn: "Manila", countryKo: "필리핀", emoji: "🇵🇭", lat: 14.5995, lng: 120.9842 },
  { slug: "kualalumpur", cityKo: "쿠알라룸푸르", cityEn: "Kuala Lumpur", countryKo: "말레이시아", emoji: "🇲🇾", lat: 3.139, lng: 101.6869 },
  // 중화권
  { slug: "taipei", cityKo: "타이베이", cityEn: "Taipei", countryKo: "대만", emoji: "🇹🇼", lat: 25.033, lng: 121.5654 },
  { slug: "hongkong", cityKo: "홍콩", cityEn: "Hong Kong", countryKo: "홍콩", emoji: "🇭🇰", lat: 22.3193, lng: 114.1694 },
  { slug: "macau", cityKo: "마카오", cityEn: "Macau", countryKo: "마카오", emoji: "🇲🇴", lat: 22.1987, lng: 113.5439 },
  { slug: "shanghai", cityKo: "상하이", cityEn: "Shanghai", countryKo: "중국", emoji: "🇨🇳", lat: 31.2304, lng: 121.4737 },
  { slug: "beijing", cityKo: "베이징", cityEn: "Beijing", countryKo: "중국", emoji: "🇨🇳", lat: 39.9042, lng: 116.4074 },
  // 유럽
  { slug: "paris", cityKo: "파리", cityEn: "Paris", countryKo: "프랑스", emoji: "🇫🇷", lat: 48.8566, lng: 2.3522 },
  { slug: "london", cityKo: "런던", cityEn: "London", countryKo: "영국", emoji: "🇬🇧", lat: 51.5074, lng: -0.1278 },
  { slug: "barcelona", cityKo: "바르셀로나", cityEn: "Barcelona", countryKo: "스페인", emoji: "🇪🇸", lat: 41.3874, lng: 2.1686 },
  { slug: "rome", cityKo: "로마", cityEn: "Rome", countryKo: "이탈리아", emoji: "🇮🇹", lat: 41.9028, lng: 12.4964 },
  // 미주/태평양
  { slug: "newyork", cityKo: "뉴욕", cityEn: "New York", countryKo: "미국", emoji: "🇺🇸", lat: 40.7128, lng: -74.006 },
  { slug: "hawaii", cityKo: "하와이", cityEn: "Hawaii", countryKo: "미국", emoji: "🇺🇸", lat: 21.3069, lng: -157.8583 },
  { slug: "guam", cityKo: "괌", cityEn: "Guam", countryKo: "괌", emoji: "🇬🇺", lat: 13.4443, lng: 144.7937 },
  { slug: "saipan", cityKo: "사이판", cityEn: "Saipan", countryKo: "사이판", emoji: "🇲🇵", lat: 15.1773, lng: 145.7505 },
  // 오세아니아
  { slug: "sydney", cityKo: "시드니", cityEn: "Sydney", countryKo: "호주", emoji: "🇦🇺", lat: -33.8688, lng: 151.2093 },
];

export const cityBySlug = Object.fromEntries(cities.map((c) => [c.slug, c]));

/** 위경도 기반으로 가장 가까운 도시를 찾는다 */
export function findNearestCity(lat: number, lng: number): City | null {
  let nearest: City | null = null;
  let minDist = Infinity;
  for (const city of cities) {
    const dlat = city.lat - lat;
    const dlng = city.lng - lng;
    const dist = dlat * dlat + dlng * dlng;
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }
  // 5도 이내에 있는 도시만 매칭 (약 500km)
  if (minDist > 25) return null;
  return nearest;
}

/** 한국 위치인지 체크 (위도 33~39, 경도 124~132) */
export function isKorea(lat: number, lng: number): boolean {
  return lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132;
}
