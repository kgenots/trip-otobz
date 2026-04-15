export interface City {
  slug: string;
  cityKo: string;
  cityEn: string;
  countryKo: string;
  emoji: string;
  lat: number;
  lng: number;
  description?: string;
  keywords?: string[];
}

export const cities: City[] = [
  // 일본
  { slug: "tokyo", cityKo: "도쿄", cityEn: "Tokyo", countryKo: "일본", emoji: "🇯🇵", lat: 35.6762, lng: 139.6503, description: "시부야 스크램블 교차로, 아사쿠사 인력거, 아키하바라 서브컬처 탐방까지! 도쿄에서 할 수 있는 모든 액티비티를 확인하세요.", keywords: ["도쿄에서 뭐하지", "도쿄 액티비티", "도쿄에서 할 것", "도쿄 투어", "도쿄 체험", "도쿄 여행"] },
  { slug: "osaka", cityKo: "오사카", cityEn: "Osaka", countryKo: "일본", emoji: "🇯🇵", lat: 34.6937, lng: 135.5023, description: "도톤보리 먹방 투어, 유니버설 스튜디오, 오사카성 야경까지! 오사카에서 놓치면 안 되는 액티비티 모음.", keywords: ["오사카에서 뭐하지", "오사카 액티비티", "오사카에서 할 것", "오사카 투어", "오사카 체험"] },
  { slug: "kyoto", cityKo: "교토", cityEn: "Kyoto", countryKo: "일본", emoji: "🇯🇵", lat: 35.0116, lng: 135.7681, description: "기요미즈데라, 후시미 이나리, 기모노 체험, 대나무숲 산책까지! 교토에서 즐기는 전통 액티비티.", keywords: ["교토에서 뭐하지", "교토 액티비티", "교토에서 할 것", "교토 투어"] },
  { slug: "fukuoka", cityKo: "후쿠오카", cityEn: "Fukuoka", countryKo: "일본", emoji: "🇯🇵", lat: 33.5904, lng: 130.4017, description: "하카타 포장마차 라멘, 텐진 쇼핑, 다자이후 당일치기까지! 후쿠오카 액티비티 총정리.", keywords: ["후쿠오카에서 뭐하지", "후쿠오카 액티비티", "후쿠오카에서 할 것", "후쿠오카 투어"] },
  { slug: "sapporo", cityKo: "삿포로", cityEn: "Sapporo", countryKo: "일본", emoji: "🇯🇵", lat: 43.0618, lng: 141.3545, description: "눈축제, 온천, 해산물 시장 투어까지! 홋카이도 삿포로에서 즐길 수 있는 베스트 액티비티.", keywords: ["삿포로에서 뭐하지", "삿포로 액티비티", "삿포로에서 할 것", "홋카이도 투어"] },
  { slug: "okinawa", cityKo: "오키나와", cityEn: "Okinawa", countryKo: "일본", emoji: "🇯🇵", lat: 26.3344, lng: 127.8056, description: "스노클링, 다이빙, 수족관, 만좌모 절경까지! 오키나와에서 즐기는 열대 액티비티.", keywords: ["오키나와에서 뭐하지", "오키나와 액티비티", "오키나와에서 할 것", "오키나와 투어", "오키나와 다이빙"] },
  { slug: "nagoya", cityKo: "나고야", cityEn: "Nagoya", countryKo: "일본", emoji: "🇯🇵", lat: 35.1815, lng: 136.9066, description: "나고야성, 아츠타 신궁, 히츠마부시 맛집 투어까지! 나고야에서 할 것 총정리.", keywords: ["나고야에서 뭐하지", "나고야 액티비티", "나고야에서 할 것", "나고야 투어"] },
  // 태국
  { slug: "bangkok", cityKo: "방콕", cityEn: "Bangkok", countryKo: "태국", emoji: "🇹🇭", lat: 13.7563, lng: 100.5018, description: "왓프라깨우, 카오산로드, 짜뚜짝 시장, 루프탑 바까지! 방콕에서 할 수 있는 모든 액티비티.", keywords: ["방콕에서 뭐하지", "방콕 액티비티", "방콕에서 할 것", "방콕 투어", "방콕 체험", "태국 액티비티"] },
  { slug: "chiangmai", cityKo: "치앙마이", cityEn: "Chiang Mai", countryKo: "태국", emoji: "🇹🇭", lat: 18.7883, lng: 98.9853, description: "도이수텝 일출, 코끼리 보호소, 야시장 쿠킹클래스까지! 치앙마이 액티비티 모음.", keywords: ["치앙마이에서 뭐하지", "치앙마이 액티비티", "치앙마이에서 할 것", "치앙마이 투어"] },
  { slug: "phuket", cityKo: "푸켓", cityEn: "Phuket", countryKo: "태국", emoji: "🇹🇭", lat: 7.8804, lng: 98.3923, description: "피피섬 투어, 팡아만 카약, 파통 나이트라이프까지! 푸켓에서 할 것 총정리.", keywords: ["푸켓에서 뭐하지", "푸켓 액티비티", "푸켓에서 할 것", "푸켓 투어", "피피섬 투어"] },
  // 베트남
  { slug: "hochiminh", cityKo: "호치민", cityEn: "Ho Chi Minh", countryKo: "베트남", emoji: "🇻🇳", lat: 10.8231, lng: 106.6297, description: "메콩델타 크루즈, 쿠치터널 탐방, 벤탄시장 먹거리까지! 호치민 베스트 액티비티.", keywords: ["호치민에서 뭐하지", "호치민 액티비티", "호치민에서 할 것", "호치민 투어", "메콩델타 투어"] },
  { slug: "hanoi", cityKo: "하노이", cityEn: "Hanoi", countryKo: "베트남", emoji: "🇻🇳", lat: 21.0278, lng: 105.8342, description: "하롱베이 크루즈, 올드쿼터 산책, 쌀국수 쿠킹클래스까지! 하노이에서 할 것 총정리.", keywords: ["하노이에서 뭐하지", "하노이 액티비티", "하노이에서 할 것", "하노이 투어", "하롱베이 투어"] },
  { slug: "danang", cityKo: "다낭", cityEn: "Da Nang", countryKo: "베트남", emoji: "🇻🇳", lat: 16.0544, lng: 108.2022, description: "바나힐, 미케비치 워터스포츠, 호이안 야시장까지! 다낭에서 꼭 해봐야 할 액티비티 모음.", keywords: ["다낭에서 뭐하지", "다낭 액티비티", "다낭에서 할 것", "다낭 투어", "다낭 체험"] },
  // 동남아 기타
  { slug: "singapore", cityKo: "싱가포르", cityEn: "Singapore", countryKo: "싱가포르", emoji: "🇸🇬", lat: 1.3521, lng: 103.8198, description: "마리나베이 야경, 가든스바이더베이, 센토사 놀이기구까지! 싱가포르 액티비티 총정리.", keywords: ["싱가포르에서 뭐하지", "싱가포르 액티비티", "싱가포르에서 할 것", "싱가포르 투어"] },
  { slug: "bali", cityKo: "발리", cityEn: "Bali", countryKo: "인도네시아", emoji: "🇮🇩", lat: -8.3405, lng: 115.092, description: "우붓 라이스테라스, 서핑, 울루와뚜 선셋 댄스까지! 발리에서 즐기는 베스트 액티비티.", keywords: ["발리에서 뭐하지", "발리 액티비티", "발리에서 할 것", "발리 투어", "발리 서핑"] },
  { slug: "cebu", cityKo: "세부", cityEn: "Cebu", countryKo: "필리핀", emoji: "🇵🇭", lat: 10.3157, lng: 123.8854, description: "오슬롭 고래상어 스노클링, 카와산 캐녀닝, 아일랜드 호핑까지! 세부 베스트 액티비티.", keywords: ["세부에서 뭐하지", "세부 액티비티", "세부에서 할 것", "세부 투어", "세부 다이빙"] },
  { slug: "manila", cityKo: "마닐라", cityEn: "Manila", countryKo: "필리핀", emoji: "🇵🇭", lat: 14.5995, lng: 120.9842, description: "인트라무로스 역사투어, 리잘공원, 마닐라 맛집 투어까지! 마닐라에서 할 것 총정리.", keywords: ["마닐라에서 뭐하지", "마닐라 액티비티", "마닐라에서 할 것", "마닐라 투어"] },
  { slug: "kualalumpur", cityKo: "쿠알라룸푸르", cityEn: "Kuala Lumpur", countryKo: "말레이시아", emoji: "🇲🇾", lat: 3.139, lng: 101.6869, description: "페트로나스 트윈타워 전망대, 바투동굴, 알로스트리트 야시장까지! 쿠알라룸푸르 액티비티.", keywords: ["쿠알라룸푸르에서 뭐하지", "쿠알라룸푸르 액티비티", "쿠알라룸푸르에서 할 것", "쿠알라룸푸르 투어"] },
  { slug: "kotakinabalu", cityKo: "코타키나발루", cityEn: "Kota Kinabalu", countryKo: "말레이시아", emoji: "🇲🇾", lat: 5.9804, lng: 116.0735, description: "키나발루산 트레킹, 선셋 크루즈, 섬 호핑까지! 코타키나발루 베스트 액티비티.", keywords: ["코타키나발루에서 뭐하지", "코타키나발루 액티비티", "코타키나발루에서 할 것", "코타키나발루 투어"] },
  { slug: "siemreap", cityKo: "시엠립", cityEn: "Siem Reap", countryKo: "캄보디아", emoji: "🇰🇭", lat: 13.3633, lng: 103.86, description: "앙코르와트 일출, 톤레삽 수상마을, 캄보디아 쿠킹클래스까지! 시엠립 액티비티 모음.", keywords: ["시엠립에서 뭐하지", "시엠립 액티비티", "시엠립에서 할 것", "앙코르와트 투어", "시엠립 투어"] },
  // 중화권
  { slug: "taipei", cityKo: "타이베이", cityEn: "Taipei", countryKo: "대만", emoji: "🇹🇼", lat: 25.033, lng: 121.5654, description: "지우펀 골목 탐방, 야시장 먹방, 타이베이 101 전망대까지! 타이베이 베스트 액티비티.", keywords: ["타이베이에서 뭐하지", "타이베이 액티비티", "타이베이에서 할 것", "대만 액티비티", "대만 투어"] },
  { slug: "hongkong", cityKo: "홍콩", cityEn: "Hong Kong", countryKo: "홍콩", emoji: "🇭🇰", lat: 22.3193, lng: 114.1694, description: "빅토리아 피크 야경, 딤섬 투어, 란타우섬 케이블카까지! 홍콩에서 할 것 총정리.", keywords: ["홍콩에서 뭐하지", "홍콩 액티비티", "홍콩에서 할 것", "홍콩 투어"] },
  { slug: "macau", cityKo: "마카오", cityEn: "Macau", countryKo: "마카오", emoji: "🇲🇴", lat: 22.1987, lng: 113.5439, description: "세나도 광장 산책, 번지점프, 카지노 체험까지! 마카오에서 즐기는 베스트 액티비티.", keywords: ["마카오에서 뭐하지", "마카오 액티비티", "마카오에서 할 것", "마카오 투어"] },
  // 중국
  { slug: "shanghai", cityKo: "상하이", cityEn: "Shanghai", countryKo: "중국", emoji: "🇨🇳", lat: 31.2304, lng: 121.4737, description: "와이탄 야경, 동방명주 전망대, 주자각 수향마을까지! 상하이에서 할 것 총정리.", keywords: ["상하이에서 뭐하지", "상하이 액티비티", "상하이에서 할 것", "상하이 투어"] },
  { slug: "beijing", cityKo: "베이징", cityEn: "Beijing", countryKo: "중국", emoji: "🇨🇳", lat: 39.9042, lng: 116.4074, description: "만리장성 트레킹, 자금성 가이드투어, 후통 골목 탐방까지! 베이징 액티비티 총정리.", keywords: ["베이징에서 뭐하지", "베이징 액티비티", "베이징에서 할 것", "베이징 투어", "만리장성 투어"] },
  // 중동
  { slug: "dubai", cityKo: "두바이", cityEn: "Dubai", countryKo: "아랍에미리트", emoji: "🇦🇪", lat: 25.2048, lng: 55.2708, description: "사막 사파리, 부르즈 할리파 전망대, 스카이다이빙까지! 두바이에서 즐기는 극한 액티비티.", keywords: ["두바이에서 뭐하지", "두바이 액티비티", "두바이에서 할 것", "두바이 투어", "사막 사파리"] },
  { slug: "istanbul", cityKo: "이스탄불", cityEn: "Istanbul", countryKo: "튀르키예", emoji: "🇹🇷", lat: 41.0082, lng: 28.9784, description: "아야소피아, 블루모스크, 그랜드 바자르 쇼핑, 보스포러스 크루즈까지! 이스탄불 액티비티 모음.", keywords: ["이스탄불에서 뭐하지", "이스탄불 액티비티", "이스탄불에서 할 것", "이스탄불 투어", "튀르키예 투어"] },
  // 몰디브
  { slug: "maldives", cityKo: "몰디브", cityEn: "Maldives", countryKo: "몰디브", emoji: "🇲🇻", lat: 4.1755, lng: 73.5093, description: "스노클링, 돌핀 크루즈, 수상 빌라 체험까지! 몰디브에서 즐기는 꿈같은 액티비티.", keywords: ["몰디브에서 뭐하지", "몰디브 액티비티", "몰디브에서 할 것", "몰디브 투어", "몰디브 스노클링"] },
  // 유럽
  { slug: "paris", cityKo: "파리", cityEn: "Paris", countryKo: "프랑스", emoji: "🇫🇷", lat: 48.8566, lng: 2.3522, description: "에펠탑 야경, 루브르 가이드투어, 센강 크루즈, 와인 테이스팅까지! 파리 베스트 액티비티.", keywords: ["파리에서 뭐하지", "파리 액티비티", "파리에서 할 것", "파리 투어", "파리 체험"] },
  { slug: "london", cityKo: "런던", cityEn: "London", countryKo: "영국", emoji: "🇬🇧", lat: 51.5074, lng: -0.1278, description: "대영박물관 가이드투어, 해리포터 스튜디오, 런던아이까지! 런던에서 할 것 총정리.", keywords: ["런던에서 뭐하지", "런던 액티비티", "런던에서 할 것", "런던 투어", "런던 체험"] },
  { slug: "barcelona", cityKo: "바르셀로나", cityEn: "Barcelona", countryKo: "스페인", emoji: "🇪🇸", lat: 41.3874, lng: 2.1686, description: "사그라다 파밀리아, 구엘공원, 플라멩코 공연, 타파스 투어까지! 바르셀로나 액티비티 모음.", keywords: ["바르셀로나에서 뭐하지", "바르셀로나 액티비티", "바르셀로나에서 할 것", "바르셀로나 투어"] },
  { slug: "rome", cityKo: "로마", cityEn: "Rome", countryKo: "이탈리아", emoji: "🇮🇹", lat: 41.9028, lng: 12.4964, description: "콜로세움 입장, 바티칸 가이드투어, 로마 푸드 투어까지! 로마에서 즐기는 베스트 액티비티.", keywords: ["로마에서 뭐하지", "로마 액티비티", "로마에서 할 것", "로마 투어", "바티칸 투어"] },
  { slug: "amsterdam", cityKo: "암스테르담", cityEn: "Amsterdam", countryKo: "네덜란드", emoji: "🇳🇱", lat: 52.3676, lng: 4.9041, description: "운하 크루즈, 반 고흐 미술관, 안네 프랑크의 집까지! 암스테르담 베스트 액티비티.", keywords: ["암스테르담에서 뭐하지", "암스테르담 액티비티", "암스테르담에서 할 것", "암스테르담 투어"] },
  { slug: "prague", cityKo: "프라하", cityEn: "Prague", countryKo: "체코", emoji: "🇨🇿", lat: 50.0755, lng: 14.4378, description: "카를교 산책, 프라하성 투어, 체코 맥주 테이스팅까지! 프라하에서 할 것 총정리.", keywords: ["프라하에서 뭐하지", "프라하 액티비티", "프라하에서 할 것", "프라하 투어"] },
  { slug: "vienna", cityKo: "빈", cityEn: "Vienna", countryKo: "오스트리아", emoji: "🇦🇹", lat: 48.2082, lng: 16.3738, description: "쇤브룬 궁전 투어, 오페라 감상, 카페 문화 체험까지! 빈에서 즐기는 베스트 액티비티.", keywords: ["빈에서 뭐하지", "빈 액티비티", "비엔나에서 할 것", "빈 투어", "비엔나 투어"] },
  { slug: "zurich", cityKo: "취리히", cityEn: "Zurich", countryKo: "스위스", emoji: "🇨🇭", lat: 47.3769, lng: 8.5417, description: "융프라우 등반, 호수 크루즈, 구시가지 산책까지! 취리히에서 즐기는 알프스 액티비티.", keywords: ["취리히에서 뭐하지", "취리히 액티비티", "스위스에서 할 것", "스위스 투어", "융프라우 투어"] },
  { slug: "lisbon", cityKo: "리스본", cityEn: "Lisbon", countryKo: "포르투갈", emoji: "🇵🇹", lat: 38.7223, lng: -9.1393, description: "트램 28번 투어, 벨렘탑, 파두 공연, 신트라 당일치기까지! 리스본 베스트 액티비티.", keywords: ["리스본에서 뭐하지", "리스본 액티비티", "리스본에서 할 것", "리스본 투어", "포르투갈 투어"] },
  { slug: "athens", cityKo: "아테네", cityEn: "Athens", countryKo: "그리스", emoji: "🇬🇷", lat: 37.9838, lng: 23.7275, description: "아크로폴리스 가이드투어, 플라카 골목 산책, 그리스 요리 클래스까지! 아테네 액티비티 모음.", keywords: ["아테네에서 뭐하지", "아테네 액티비티", "아테네에서 할 것", "아테네 투어", "그리스 투어"] },
  { slug: "helsinki", cityKo: "헬싱키", cityEn: "Helsinki", countryKo: "핀란드", emoji: "🇫🇮", lat: 60.1699, lng: 24.9384, description: "사우나 체험, 오로라 투어, 디자인 디스트릭트 산책까지! 헬싱키에서 할 것 총정리.", keywords: ["헬싱키에서 뭐하지", "헬싱키 액티비티", "헬싱키에서 할 것", "핀란드 투어", "오로라 투어"] },
  // 미주
  { slug: "newyork", cityKo: "뉴욕", cityEn: "New York", countryKo: "미국", emoji: "🇺🇸", lat: 40.7128, lng: -74.006, description: "브로드웨이 뮤지컬, 자유의 여신상, 센트럴파크 투어까지! 뉴욕에서 즐기는 베스트 액티비티.", keywords: ["뉴욕에서 뭐하지", "뉴욕 액티비티", "뉴욕에서 할 것", "뉴욕 투어", "브로드웨이"] },
  { slug: "losangeles", cityKo: "로스앤젤레스", cityEn: "Los Angeles", countryKo: "미국", emoji: "🇺🇸", lat: 34.0522, lng: -118.2437, description: "할리우드 투어, 유니버설 스튜디오, 산타모니카 자전거까지! LA에서 할 것 총정리.", keywords: ["LA에서 뭐하지", "로스앤젤레스 액티비티", "LA에서 할 것", "LA 투어"] },
  { slug: "sanfrancisco", cityKo: "샌프란시스코", cityEn: "San Francisco", countryKo: "미국", emoji: "🇺🇸", lat: 37.7749, lng: -122.4194, description: "알카트라즈 투어, 골든게이트 자전거, 피어39까지! 샌프란시스코에서 할 것 총정리.", keywords: ["샌프란시스코에서 뭐하지", "샌프란시스코 액티비티", "샌프란시스코에서 할 것", "샌프란시스코 투어"] },
  { slug: "lasvegas", cityKo: "라스베이거스", cityEn: "Las Vegas", countryKo: "미국", emoji: "🇺🇸", lat: 36.1699, lng: -115.1398, description: "그랜드캐니언 투어, 시르크 뒤 솔레이유, 헬리콥터 야경까지! 라스베이거스 베스트 액티비티.", keywords: ["라스베이거스에서 뭐하지", "라스베이거스 액티비티", "라스베이거스에서 할 것", "그랜드캐니언 투어"] },
  { slug: "hawaii", cityKo: "하와이", cityEn: "Hawaii", countryKo: "미국", emoji: "🇺🇸", lat: 21.3069, lng: -157.8583, description: "와이키키 서핑, 다이아몬드 헤드 트레킹, 하나우마 베이 스노클링까지! 하와이 베스트 액티비티.", keywords: ["하와이에서 뭐하지", "하와이 액티비티", "하와이에서 할 것", "하와이 투어", "하와이 서핑"] },
  { slug: "cancun", cityKo: "칸쿤", cityEn: "Cancun", countryKo: "멕시코", emoji: "🇲🇽", lat: 21.1619, lng: -86.8515, description: "세노테 다이빙, 치첸이트사 투어, 카리브해 스노클링까지! 칸쿤에서 즐기는 베스트 액티비티.", keywords: ["칸쿤에서 뭐하지", "칸쿤 액티비티", "칸쿤에서 할 것", "칸쿤 투어", "세노테 다이빙"] },
  // 태평양
  { slug: "guam", cityKo: "괌", cityEn: "Guam", countryKo: "괌", emoji: "🇬🇺", lat: 13.4443, lng: 144.7937, description: "사격 체험, 투몬비치 스노클링, 정글 트레킹까지! 괌에서 즐기는 베스트 액티비티.", keywords: ["괌에서 뭐하지", "괌 액티비티", "괌에서 할 것", "괌 투어", "괌 체험"] },
  { slug: "saipan", cityKo: "사이판", cityEn: "Saipan", countryKo: "사이판", emoji: "🇲🇵", lat: 15.1773, lng: 145.7505, description: "마나가하섬 스노클링, 그로토 다이빙, 정글 ATV까지! 사이판 베스트 액티비티.", keywords: ["사이판에서 뭐하지", "사이판 액티비티", "사이판에서 할 것", "사이판 투어", "사이판 다이빙"] },
  // 오세아니아
  { slug: "sydney", cityKo: "시드니", cityEn: "Sydney", countryKo: "호주", emoji: "🇦🇺", lat: -33.8688, lng: 151.2093, description: "오페라하우스 투어, 하버브릿지 클라이밍, 본다이비치 서핑까지! 시드니 베스트 액티비티.", keywords: ["시드니에서 뭐하지", "시드니 액티비티", "시드니에서 할 것", "시드니 투어", "호주 액티비티"] },
  { slug: "melbourne", cityKo: "멜버른", cityEn: "Melbourne", countryKo: "호주", emoji: "🇦🇺", lat: -37.8136, lng: 144.9631, description: "그레이트 오션로드 투어, 레인웨이 아트, 커피 투어까지! 멜버른에서 할 것 총정리.", keywords: ["멜버른에서 뭐하지", "멜버른 액티비티", "멜버른에서 할 것", "멜버른 투어", "그레이트오션로드"] },
  { slug: "auckland", cityKo: "오클랜드", cityEn: "Auckland", countryKo: "뉴질랜드", emoji: "🇳🇿", lat: -36.8485, lng: 174.7633, description: "스카이점프, 와이헤케섬 와이너리, 반지의 제왕 호빗투어까지! 오클랜드 베스트 액티비티.", keywords: ["오클랜드에서 뭐하지", "오클랜드 액티비티", "뉴질랜드에서 할 것", "뉴질랜드 투어", "호빗 투어"] },
  // 아프리카
  { slug: "cairo", cityKo: "카이로", cityEn: "Cairo", countryKo: "이집트", emoji: "🇪🇬", lat: 30.0444, lng: 31.2357, description: "피라미드 낙타 투어, 나일강 크루즈, 이집트 박물관 가이드까지! 카이로 베스트 액티비티.", keywords: ["카이로에서 뭐하지", "카이로 액티비티", "이집트에서 할 것", "이집트 투어", "피라미드 투어"] },
];

export const cityBySlug = Object.fromEntries(cities.map((c) => [c.slug, c]));

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
  if (minDist > 25) return null;
  return nearest;
}

export function isKorea(lat: number, lng: number): boolean {
  return lat >= 33 && lat <= 39 && lng >= 124 && lng <= 132;
}
