// IATA 도시코드 → { 국가 ISO alpha-2, 도시 한글명, 국가 한글명 }
export interface CityInfo {
  country: string;
  cityKo: string;
  countryKo: string;
}

export const cityCountryMap: Record<string, CityInfo> = {
  // 일본
  NRT: { country: "JP", cityKo: "도쿄 (나리타)", countryKo: "일본" },
  TYO: { country: "JP", cityKo: "도쿄", countryKo: "일본" },
  HND: { country: "JP", cityKo: "도쿄 (하네다)", countryKo: "일본" },
  KIX: { country: "JP", cityKo: "오사카", countryKo: "일본" },
  FUK: { country: "JP", cityKo: "후쿠오카", countryKo: "일본" },
  CTS: { country: "JP", cityKo: "삿포로", countryKo: "일본" },
  NGO: { country: "JP", cityKo: "나고야", countryKo: "일본" },
  OKA: { country: "JP", cityKo: "오키나와", countryKo: "일본" },
  // 중국
  PEK: { country: "CN", cityKo: "베이징", countryKo: "중국" },
  PVG: { country: "CN", cityKo: "상하이", countryKo: "중국" },
  CAN: { country: "CN", cityKo: "광저우", countryKo: "중국" },
  SZX: { country: "CN", cityKo: "선전", countryKo: "중국" },
  CTU: { country: "CN", cityKo: "청두", countryKo: "중국" },
  HGH: { country: "CN", cityKo: "항저우", countryKo: "중국" },
  CSX: { country: "CN", cityKo: "창사", countryKo: "중국" },
  TAO: { country: "CN", cityKo: "칭다오", countryKo: "중국" },
  DLC: { country: "CN", cityKo: "다롄", countryKo: "중국" },
  // 대만
  TPE: { country: "TW", cityKo: "타이베이", countryKo: "대만" },
  KHH: { country: "TW", cityKo: "가오슝", countryKo: "대만" },
  // 홍콩/마카오
  HKG: { country: "HK", cityKo: "홍콩", countryKo: "홍콩" },
  MFM: { country: "MO", cityKo: "마카오", countryKo: "마카오" },
  // 동남아
  BKK: { country: "TH", cityKo: "방콕", countryKo: "태국" },
  CNX: { country: "TH", cityKo: "치앙마이", countryKo: "태국" },
  HKT: { country: "TH", cityKo: "푸켓", countryKo: "태국" },
  SGN: { country: "VN", cityKo: "호치민", countryKo: "베트남" },
  HAN: { country: "VN", cityKo: "하노이", countryKo: "베트남" },
  DAD: { country: "VN", cityKo: "다낭", countryKo: "베트남" },
  SIN: { country: "SG", cityKo: "싱가포르", countryKo: "싱가포르" },
  KUL: { country: "MY", cityKo: "쿠알라룸푸르", countryKo: "말레이시아" },
  BKI: { country: "MY", cityKo: "코타키나발루", countryKo: "말레이시아" },
  MNL: { country: "PH", cityKo: "마닐라", countryKo: "필리핀" },
  CEB: { country: "PH", cityKo: "세부", countryKo: "필리핀" },
  CGK: { country: "ID", cityKo: "자카르타", countryKo: "인도네시아" },
  DPS: { country: "ID", cityKo: "발리", countryKo: "인도네시아" },
  PNH: { country: "KH", cityKo: "프놈펜", countryKo: "캄보디아" },
  REP: { country: "KH", cityKo: "시엠립", countryKo: "캄보디아" },
  RGN: { country: "MM", cityKo: "양곤", countryKo: "미얀마" },
  VTE: { country: "LA", cityKo: "비엔티안", countryKo: "라오스" },
  // 남아시아
  DEL: { country: "IN", cityKo: "델리", countryKo: "인도" },
  BOM: { country: "IN", cityKo: "뭄바이", countryKo: "인도" },
  CMB: { country: "LK", cityKo: "콜롬보", countryKo: "스리랑카" },
  KTM: { country: "NP", cityKo: "카트만두", countryKo: "네팔" },
  // 중앙아시아/중동
  DXB: { country: "AE", cityKo: "두바이", countryKo: "아랍에미리트" },
  AUH: { country: "AE", cityKo: "아부다비", countryKo: "아랍에미리트" },
  IST: { country: "TR", cityKo: "이스탄불", countryKo: "튀르키예" },
  TLV: { country: "IL", cityKo: "텔아비브", countryKo: "이스라엘" },
  DOH: { country: "QA", cityKo: "도하", countryKo: "카타르" },
  NQZ: { country: "KZ", cityKo: "누르술탄", countryKo: "카자흐스탄" },
  ALA: { country: "KZ", cityKo: "알마티", countryKo: "카자흐스탄" },
  TAS: { country: "UZ", cityKo: "타슈켄트", countryKo: "우즈베키스탄" },
  // 유럽
  CDG: { country: "FR", cityKo: "파리", countryKo: "프랑스" },
  LHR: { country: "GB", cityKo: "런던", countryKo: "영국" },
  FCO: { country: "IT", cityKo: "로마", countryKo: "이탈리아" },
  MXP: { country: "IT", cityKo: "밀라노", countryKo: "이탈리아" },
  BCN: { country: "ES", cityKo: "바르셀로나", countryKo: "스페인" },
  MAD: { country: "ES", cityKo: "마드리드", countryKo: "스페인" },
  FRA: { country: "DE", cityKo: "프랑크푸르트", countryKo: "독일" },
  MUC: { country: "DE", cityKo: "뮌헨", countryKo: "독일" },
  AMS: { country: "NL", cityKo: "암스테르담", countryKo: "네덜란드" },
  ZRH: { country: "CH", cityKo: "취리히", countryKo: "스위스" },
  VIE: { country: "AT", cityKo: "빈", countryKo: "오스트리아" },
  PRG: { country: "CZ", cityKo: "프라하", countryKo: "체코" },
  BUD: { country: "HU", cityKo: "부다페스트", countryKo: "헝가리" },
  WAW: { country: "PL", cityKo: "바르샤바", countryKo: "폴란드" },
  LIS: { country: "PT", cityKo: "리스본", countryKo: "포르투갈" },
  ATH: { country: "GR", cityKo: "아테네", countryKo: "그리스" },
  HEL: { country: "FI", cityKo: "헬싱키", countryKo: "핀란드" },
  CPH: { country: "DK", cityKo: "코펜하겐", countryKo: "덴마크" },
  OSL: { country: "NO", cityKo: "오슬로", countryKo: "노르웨이" },
  ARN: { country: "SE", cityKo: "스톡홀름", countryKo: "스웨덴" },
  DUB: { country: "IE", cityKo: "더블린", countryKo: "아일랜드" },
  BRU: { country: "BE", cityKo: "브뤼셀", countryKo: "벨기에" },
  ZAG: { country: "HR", cityKo: "자그레브", countryKo: "크로아티아" },
  OTP: { country: "RO", cityKo: "부쿠레슈티", countryKo: "루마니아" },
  SOF: { country: "BG", cityKo: "소피아", countryKo: "불가리아" },
  // 러시아/CIS
  SVO: { country: "RU", cityKo: "모스크바", countryKo: "러시아" },
  LED: { country: "RU", cityKo: "상트페테르부르크", countryKo: "러시아" },
  // 북미
  LAX: { country: "US", cityKo: "로스앤젤레스", countryKo: "미국" },
  JFK: { country: "US", cityKo: "뉴욕", countryKo: "미국" },
  SFO: { country: "US", cityKo: "샌프란시스코", countryKo: "미국" },
  HNL: { country: "US", cityKo: "호놀룰루", countryKo: "미국" },
  LAS: { country: "US", cityKo: "라스베이거스", countryKo: "미국" },
  SEA: { country: "US", cityKo: "시애틀", countryKo: "미국" },
  ORD: { country: "US", cityKo: "시카고", countryKo: "미국" },
  ATL: { country: "US", cityKo: "애틀랜타", countryKo: "미국" },
  DFW: { country: "US", cityKo: "댈러스", countryKo: "미국" },
  GUM: { country: "GU", cityKo: "괌", countryKo: "괌" },
  SPN: { country: "MP", cityKo: "사이판", countryKo: "사이판" },
  YVR: { country: "CA", cityKo: "밴쿠버", countryKo: "캐나다" },
  YYZ: { country: "CA", cityKo: "토론토", countryKo: "캐나다" },
  // 중남미
  CUN: { country: "MX", cityKo: "칸쿤", countryKo: "멕시코" },
  MEX: { country: "MX", cityKo: "멕시코시티", countryKo: "멕시코" },
  GRU: { country: "BR", cityKo: "상파울루", countryKo: "브라질" },
  LIM: { country: "PE", cityKo: "리마", countryKo: "페루" },
  SCL: { country: "CL", cityKo: "산티아고", countryKo: "칠레" },
  BOG: { country: "CO", cityKo: "보고타", countryKo: "콜롬비아" },
  EZE: { country: "AR", cityKo: "부에노스아이레스", countryKo: "아르헨티나" },
  // 오세아니아
  SYD: { country: "AU", cityKo: "시드니", countryKo: "호주" },
  MEL: { country: "AU", cityKo: "멜버른", countryKo: "호주" },
  BNE: { country: "AU", cityKo: "브리즈번", countryKo: "호주" },
  AKL: { country: "NZ", cityKo: "오클랜드", countryKo: "뉴질랜드" },
  NAN: { country: "FJ", cityKo: "난디", countryKo: "피지" },
  // 아프리카
  CAI: { country: "EG", cityKo: "카이로", countryKo: "이집트" },
  CPT: { country: "ZA", cityKo: "케이프타운", countryKo: "남아공" },
  JNB: { country: "ZA", cityKo: "요하네스버그", countryKo: "남아공" },
  NBO: { country: "KE", cityKo: "나이로비", countryKo: "케냐" },
  ADD: { country: "ET", cityKo: "아디스아바바", countryKo: "에티오피아" },
  CMN: { country: "MA", cityKo: "카사블랑카", countryKo: "모로코" },
  TUN: { country: "TN", cityKo: "튀니스", countryKo: "튀니지" },
  // 몰디브
  MLE: { country: "MV", cityKo: "말레", countryKo: "몰디브" },
  DAR: { country: "TZ", cityKo: "다르에스살람", countryKo: "탄자니아" },
  MRU: { country: "MU", cityKo: "모리셔스", countryKo: "모리셔스" },
  // 한국
  ICN: { country: "KR", cityKo: "서울 (인천)", countryKo: "한국" },
  TAE: { country: "KR", cityKo: "대구", countryKo: "한국" },
  PUS: { country: "KR", cityKo: "부산", countryKo: "한국" },
};

// 국가코드 → 대표 도시코드 (지도에서 국가 클릭 시 사용)
export function getCountryCities(countryCode: string): string[] {
  return Object.entries(cityCountryMap)
    .filter(([, info]) => info.country === countryCode)
    .map(([code]) => code);
}

// 국가코드 → 국가 한글명
export function getCountryName(countryCode: string): string | undefined {
  const entry = Object.values(cityCountryMap).find(info => info.country === countryCode);
  return entry?.countryKo;
}

// 도시코드 → 국가코드
export function getCityCountry(cityCode: string): string | undefined {
  return cityCountryMap[cityCode]?.country;
}
