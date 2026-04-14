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
  { slug: "nagoya", cityCode: "NGO", cityKo: "나고야", countryKo: "일본", description: "일본 중부의 중심 나고야! 나고야성, 아츠타 신궁, 히츠마부시. 나고야 항공권·숙소 최저가.", keywords: ["나고야 항공권", "나고야 여행", "나고야 숙소"] },
  // 동남아
  { slug: "bangkok", cityCode: "BKK", cityKo: "방콕", countryKo: "태국", description: "태국의 수도 방콕! 왓프라깨우, 카오산로드, 짜뚜짝 시장까지. 방콕 항공권·숙소·투어 최저가.", keywords: ["방콕 항공권", "방콕 숙소", "방콕 여행", "태국 항공권"] },
  { slug: "danang", cityCode: "DAD", cityKo: "다낭", countryKo: "베트남", description: "베트남 중부의 해변 도시 다낭! 바나힐, 미케비치, 호이안까지. 다낭 항공권·숙소·투어 최저가.", keywords: ["다낭 항공권", "다낭 숙소", "다낭 여행", "베트남 항공권"] },
  { slug: "hanoi", cityCode: "HAN", cityKo: "하노이", countryKo: "베트남", description: "베트남의 수도 하노이! 호안끼엠 호수, 하롱베이, 쌀국수의 본고장. 하노이 항공권·숙소 최저가.", keywords: ["하노이 항공권", "하노이 여행", "하노이 숙소"] },
  { slug: "cebu", cityCode: "CEB", cityKo: "세부", countryKo: "필리핀", description: "필리핀 최고의 휴양지 세부! 오슬롭 고래상어, 카와산 폭포, 아일랜드 호핑. 세부 항공권·숙소 최저가.", keywords: ["세부 항공권", "세부 여행", "세부 숙소", "필리핀 항공권"] },
  { slug: "singapore", cityCode: "SIN", cityKo: "싱가포르", countryKo: "싱가포르", description: "아시아의 보석 싱가포르! 마리나베이샌즈, 가든스바이더베이, 센토사. 싱가포르 항공권·숙소 최저가.", keywords: ["싱가포르 항공권", "싱가포르 여행", "싱가포르 숙소"] },
  { slug: "bali", cityCode: "DPS", cityKo: "발리", countryKo: "인도네시아", description: "신들의 섬 발리! 우붓, 꾸따 비치, 울루와뚜 사원까지. 발리 항공권·숙소·투어 최저가.", keywords: ["발리 항공권", "발리 여행", "발리 숙소", "인도네시아 항공권"] },
  { slug: "chiangmai", cityCode: "CNX", cityKo: "치앙마이", countryKo: "태국", description: "태국 북부의 고즈넉한 고도 치앙마이! 올드시티, 도이수텝, 야시장. 치앙마이 항공권·숙소 최저가.", keywords: ["치앙마이 항공권", "치앙마이 여행", "치앙마이 숙소"] },
  { slug: "phuket", cityCode: "HKT", cityKo: "푸켓", countryKo: "태국", description: "태국 최대의 섬 푸켓! 파통비치, 피피섬, 팡아만 투어. 푸켓 항공권·숙소·투어 최저가.", keywords: ["푸켓 항공권", "푸켓 여행", "푸켓 숙소", "태국 섬"] },
  { slug: "hochiminh", cityCode: "SGN", cityKo: "호치민", countryKo: "베트남", description: "베트남 최대 도시 호치민! 벤탄시장, 전쟁박물관, 메콩델타 투어. 호치민 항공권·숙소 최저가.", keywords: ["호치민 항공권", "호치민 여행", "호치민 숙소"] },
  { slug: "kualalumpur", cityCode: "KUL", cityKo: "쿠알라룸푸르", countryKo: "말레이시아", description: "말레이시아의 수도 쿠알라룸푸르! 페트로나스 트윈타워, 바투동굴, 알로스트리트. 쿠알라룸푸르 항공권·숙소 최저가.", keywords: ["쿠알라룸푸르 항공권", "쿠알라룸푸르 여행", "말레이시아 항공권"] },
  { slug: "kotakinabalu", cityCode: "BKI", cityKo: "코타키나발루", countryKo: "말레이시아", description: "보르네오의 보석 코타키나발루! 키나발루산, 선셋, 섬 투어. 코타키나발루 항공권·숙소 최저가.", keywords: ["코타키나발루 항공권", "코타키나발루 여행", "코타키나발루 숙소"] },
  { slug: "manila", cityCode: "MNL", cityKo: "마닐라", countryKo: "필리핀", description: "필리핀의 수도 마닐라! 인트라무로스, 리잘공원, 맛집 투어. 마닐라 항공권·숙소 최저가.", keywords: ["마닐라 항공권", "마닐라 여행", "필리핀 항공권"] },
  { slug: "siemreap", cityCode: "REP", cityKo: "시엠립", countryKo: "캄보디아", description: "앙코르와트의 도시 시엠립! 세계 최대 힌두 사원 유적, 톤레삽 호수. 시엠립 항공권·숙소 최저가.", keywords: ["시엠립 항공권", "시엠립 여행", "앙코르와트", "캄보디아 항공권"] },
  // 중화권
  { slug: "taipei", cityCode: "TPE", cityKo: "타이베이", countryKo: "대만", description: "대만의 수도 타이베이! 지우펀, 타이베이 101, 야시장 맛집 투어. 타이베이 항공권·숙소 최저가.", keywords: ["타이베이 항공권", "대만 항공권", "타이베이 여행", "대만 여행"] },
  { slug: "hongkong", cityCode: "HKG", cityKo: "홍콩", countryKo: "홍콩", description: "동양과 서양이 만나는 홍콩! 빅토리아 피크, 란콰이펑, 딤섬. 홍콩 항공권·숙소 최저가.", keywords: ["홍콩 항공권", "홍콩 여행", "홍콩 숙소"] },
  { slug: "macau", cityCode: "MFM", cityKo: "마카오", countryKo: "마카오", description: "동양의 라스베이거스 마카오! 세나도 광장, 성 바울 성당, 카지노. 마카오 항공권·숙소 최저가.", keywords: ["마카오 항공권", "마카오 여행", "마카오 숙소"] },
  // 중국
  { slug: "beijing", cityCode: "PEK", cityKo: "베이징", countryKo: "중국", description: "중국의 수도 베이징! 자금성, 만리장성, 천안문 광장. 베이징 항공권·숙소 최저가.", keywords: ["베이징 항공권", "베이징 여행", "중국 항공권"] },
  { slug: "shanghai", cityCode: "PVG", cityKo: "상하이", countryKo: "중국", description: "중국 최대의 국제도시 상하이! 와이탄, 동방명주, 난징루. 상하이 항공권·숙소 최저가.", keywords: ["상하이 항공권", "상하이 여행", "중국 항공권"] },
  // 중동
  { slug: "dubai", cityCode: "DXB", cityKo: "두바이", countryKo: "아랍에미리트", description: "사막 위의 초현대 도시 두바이! 부르즈 할리파, 팜 주메이라, 사막 사파리. 두바이 항공권·숙소 최저가.", keywords: ["두바이 항공권", "두바이 여행", "두바이 숙소"] },
  { slug: "istanbul", cityCode: "IST", cityKo: "이스탄불", countryKo: "튀르키예", description: "동서양의 교차로 이스탄불! 아야소피아, 블루모스크, 그랜드 바자르. 이스탄불 항공권·숙소 최저가.", keywords: ["이스탄불 항공권", "이스탄불 여행", "튀르키예 항공권", "터키 여행"] },
  // 몰디브
  { slug: "maldives", cityCode: "MLE", cityKo: "몰디브", countryKo: "몰디브", description: "지상낙원 몰디브! 수상 빌라, 스노클링, 산호초 바다. 몰디브 항공권·숙소 최저가.", keywords: ["몰디브 항공권", "몰디브 여행", "몰디브 리조트"] },
  // 장거리
  { slug: "paris", cityCode: "PAR", cityKo: "파리", countryKo: "프랑스", description: "낭만의 도시 파리! 에펠탑, 루브르, 샹젤리제. 파리 항공권·숙소·투어 최저가.", keywords: ["파리 항공권", "파리 여행", "프랑스 항공권", "유럽 항공권"] },
  { slug: "london", cityCode: "LON", cityKo: "런던", countryKo: "영국", description: "대영제국의 수도 런던! 빅벤, 대영박물관, 타워브릿지. 런던 항공권·숙소 최저가.", keywords: ["런던 항공권", "런던 여행", "영국 항공권"] },
  { slug: "rome", cityCode: "FCO", cityKo: "로마", countryKo: "이탈리아", description: "영원의 도시 로마! 콜로세움, 바티칸, 트레비 분수. 로마 항공권·숙소·투어 최저가.", keywords: ["로마 항공권", "로마 여행", "이탈리아 항공권"] },
  { slug: "barcelona", cityCode: "BCN", cityKo: "바르셀로나", countryKo: "스페인", description: "가우디의 도시 바르셀로나! 사그라다 파밀리아, 구엘공원, 람블라스 거리. 바르셀로나 항공권·숙소 최저가.", keywords: ["바르셀로나 항공권", "바르셀로나 여행", "스페인 항공권"] },
  { slug: "amsterdam", cityCode: "AMS", cityKo: "암스테르담", countryKo: "네덜란드", description: "자유의 도시 암스테르담! 운하, 반 고흐 미술관, 안네 프랑크의 집. 암스테르담 항공권·숙소 최저가.", keywords: ["암스테르담 항공권", "암스테르담 여행", "네덜란드 항공권"] },
  { slug: "prague", cityCode: "PRG", cityKo: "프라하", countryKo: "체코", description: "동유럽의 보석 프라하! 카를교, 프라하성, 구시가 광장. 프라하 항공권·숙소 최저가.", keywords: ["프라하 항공권", "프라하 여행", "체코 항공권"] },
  { slug: "vienna", cityCode: "VIE", cityKo: "빈", countryKo: "오스트리아", description: "음악의 도시 빈! 쇤브룬 궁전, 슈테판 대성당, 카페 문화. 빈 항공권·숙소 최저가.", keywords: ["빈 항공권", "빈 여행", "오스트리아 항공권", "비엔나 여행"] },
  { slug: "zurich", cityCode: "ZRH", cityKo: "취리히", countryKo: "스위스", description: "알프스의 관문 취리히! 호수, 구시가지, 융프라우 근교 여행. 취리히 항공권·숙소 최저가.", keywords: ["취리히 항공권", "스위스 항공권", "스위스 여행"] },
  { slug: "lisbon", cityCode: "LIS", cityKo: "리스본", countryKo: "포르투갈", description: "대항해 시대의 항구 리스본! 벨렘탑, 제로니무스 수도원, 트램 28번. 리스본 항공권·숙소 최저가.", keywords: ["리스본 항공권", "리스본 여행", "포르투갈 항공권"] },
  { slug: "athens", cityCode: "ATH", cityKo: "아테네", countryKo: "그리스", description: "서양 문명의 발상지 아테네! 파르테논 신전, 아크로폴리스, 플라카. 아테네 항공권·숙소 최저가.", keywords: ["아테네 항공권", "아테네 여행", "그리스 항공권", "그리스 여행"] },
  { slug: "helsinki", cityCode: "HEL", cityKo: "헬싱키", countryKo: "핀란드", description: "북유럽의 디자인 수도 헬싱키! 사우나, 오로라, 산타클로스 마을 근교. 헬싱키 항공권·숙소 최저가.", keywords: ["헬싱키 항공권", "헬싱키 여행", "핀란드 항공권"] },
  { slug: "honolulu", cityCode: "HNL", cityKo: "호놀룰루", countryKo: "미국", description: "하와이의 심장 호놀룰루! 와이키키 비치, 다이아몬드 헤드. 호놀룰루 항공권·숙소 최저가.", keywords: ["하와이 항공권", "호놀룰루 항공권", "하와이 여행"] },
  { slug: "guam", cityCode: "GUM", cityKo: "괌", countryKo: "미국", description: "가까운 미국 괌! 투몬비치, 사랑의 절벽, 면세 쇼핑. 괌 항공권·숙소 최저가.", keywords: ["괌 항공권", "괌 여행", "괌 숙소", "괌 최저가"] },
  { slug: "saipan", cityCode: "SPN", cityKo: "사이판", countryKo: "사이판", description: "태평양의 휴양지 사이판! 마나가하섬, 그로토, 만세절벽. 사이판 항공권·숙소 최저가.", keywords: ["사이판 항공권", "사이판 여행", "사이판 숙소"] },
  { slug: "losangeles", cityCode: "LAX", cityKo: "로스앤젤레스", countryKo: "미국", description: "엔터테인먼트의 수도 LA! 할리우드, 산타모니카, 유니버설 스튜디오. LA 항공권·숙소 최저가.", keywords: ["LA 항공권", "로스앤젤레스 항공권", "미국 항공권"] },
  { slug: "newyork", cityCode: "JFK", cityKo: "뉴욕", countryKo: "미국", description: "세계의 중심 뉴욕! 타임스퀘어, 센트럴파크, 자유의 여신상. 뉴욕 항공권·숙소 최저가.", keywords: ["뉴욕 항공권", "뉴욕 여행", "미국 항공권"] },
  { slug: "sanfrancisco", cityCode: "SFO", cityKo: "샌프란시스코", countryKo: "미국", description: "골든게이트의 도시 샌프란시스코! 피어39, 케이블카, 실리콘밸리. 샌프란시스코 항공권·숙소 최저가.", keywords: ["샌프란시스코 항공권", "샌프란시스코 여행", "미국 서부"] },
  { slug: "lasvegas", cityCode: "LAS", cityKo: "라스베이거스", countryKo: "미국", description: "사막 속 엔터테인먼트 도시 라스베이거스! 스트립, 그랜드캐니언 투어. 라스베이거스 항공권·숙소 최저가.", keywords: ["라스베이거스 항공권", "라스베이거스 여행", "그랜드캐니언"] },
  { slug: "cancun", cityCode: "CUN", cityKo: "칸쿤", countryKo: "멕시코", description: "카리브해의 파라다이스 칸쿤! 올인클루시브 리조트, 치첸이트사, 세노테. 칸쿤 항공권·숙소 최저가.", keywords: ["칸쿤 항공권", "칸쿤 여행", "멕시코 항공권"] },
  // 오세아니아
  { slug: "sydney", cityCode: "SYD", cityKo: "시드니", countryKo: "호주", description: "호주의 상징 시드니! 오페라하우스, 하버브릿지, 본다이비치. 시드니 항공권·숙소 최저가.", keywords: ["시드니 항공권", "호주 항공권", "시드니 여행"] },
  { slug: "melbourne", cityCode: "MEL", cityKo: "멜버른", countryKo: "호주", description: "호주 문화의 수도 멜버른! 그레이트 오션로드, 커피 문화, 레인웨이 아트. 멜버른 항공권·숙소 최저가.", keywords: ["멜버른 항공권", "멜버른 여행", "호주 항공권"] },
  { slug: "auckland", cityCode: "AKL", cityKo: "오클랜드", countryKo: "뉴질랜드", description: "뉴질랜드 최대 도시 오클랜드! 스카이타워, 와이헤케섬, 반지의 제왕 투어. 오클랜드 항공권·숙소 최저가.", keywords: ["오클랜드 항공권", "뉴질랜드 항공권", "뉴질랜드 여행"] },
  // 아프리카
  { slug: "cairo", cityCode: "CAI", cityKo: "카이로", countryKo: "이집트", description: "파라오의 도시 카이로! 피라미드, 스핑크스, 이집트 박물관. 카이로 항공권·숙소 최저가.", keywords: ["카이로 항공권", "이집트 항공권", "이집트 여행", "피라미드"] },
];

export const destinationBySlug = Object.fromEntries(
  destinations.map((d) => [d.slug, d])
);
