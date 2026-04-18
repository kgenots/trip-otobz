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
  { slug: "tokyo", cityCode: "TYO", cityKo: "도쿄", countryKo: "일본", description: "시부야 스크램블 교차로, 아사쿠사 인력거, 아키하바라 서브컬처 탐방까지! 도쿄에서 할 수 있는 모든 액티비티를 확인하세요.", keywords: ["도쿄에서 뭐하지", "도쿄 액티비티", "도쿄에서 할 것", "도쿄 투어", "도쿄 체험", "도쿄 여행"] },
  { slug: "osaka", cityCode: "KIX", cityKo: "오사카", countryKo: "일본", description: "도톤보리 먹방 투어, 유니버설 스튜디오, 오사카성 야경까지! 오사카에서 놓치면 안 되는 액티비티 모음.", keywords: ["오사카에서 뭐하지", "오사카 액티비티", "오사카에서 할 것", "오사카 투어", "오사카 체험"] },
  { slug: "fukuoka", cityCode: "FUK", cityKo: "후쿠오카", countryKo: "일본", description: "하카타 포장마차 라멘, 텐진 쇼핑, 다자이후 당일치기까지! 후쿠오카 액티비티 총정리.", keywords: ["후쿠오카에서 뭐하지", "후쿠오카 액티비티", "후쿠오카에서 할 것", "후쿠오카 투어"] },
  { slug: "sapporo", cityCode: "CTS", cityKo: "삿포로", countryKo: "일본", description: "눈축제, 온천, 해산물 시장 투어까지! 홋카이도 삿포로에서 즐길 수 있는 베스트 액티비티.", keywords: ["삿포로에서 뭐하지", "삿포로 액티비티", "삿포로에서 할 것", "홋카이도 투어"] },
  { slug: "okinawa", cityCode: "OKA", cityKo: "오키나와", countryKo: "일본", description: "스노클링, 다이빙, 수족관, 만좌모 절경까지! 오키나와에서 즐기는 열대 액티비티.", keywords: ["오키나와에서 뭐하지", "오키나와 액티비티", "오키나와에서 할 것", "오키나와 투어", "오키나와 다이빙"] },
  { slug: "nagoya", cityCode: "NGO", cityKo: "나고야", countryKo: "일본", description: "나고야성, 아츠타 신궁, 히츠마부시 맛집 투어까지! 나고야에서 할 것 총정리.", keywords: ["나고야에서 뭐하지", "나고야 액티비티", "나고야에서 할 것", "나고야 투어"] },
  // 동남아
  { slug: "bangkok", cityCode: "BKK", cityKo: "방콕", countryKo: "태국", description: "왓프라깨우, 카오산로드, 짜뚜짝 시장, 루프탑 바까지! 방콕에서 할 수 있는 모든 액티비티.", keywords: ["방콕에서 뭐하지", "방콕 액티비티", "방콕에서 할 것", "방콕 투어", "방콕 체험", "태국 액티비티"] },
  { slug: "danang", cityCode: "DAD", cityKo: "다낭", countryKo: "베트남", description: "바나힐, 미케비치 워터스포츠, 호이안 야시장까지! 다낭에서 꼭 해봐야 할 액티비티 모음.", keywords: ["다낭에서 뭐하지", "다낭 액티비티", "다낭에서 할 것", "다낭 투어", "다낭 체험"] },
  { slug: "hanoi", cityCode: "HAN", cityKo: "하노이", countryKo: "베트남", description: "하롱베이 크루즈, 올드쿼터 산책, 쌀국수 쿠킹클래스까지! 하노이에서 할 것 총정리.", keywords: ["하노이에서 뭐하지", "하노이 액티비티", "하노이에서 할 것", "하노이 투어", "하롱베이 투어"] },
  { slug: "cebu", cityCode: "CEB", cityKo: "세부", countryKo: "필리핀", description: "오슬롭 고래상어 스노클링, 카와산 캐녀닝, 아일랜드 호핑까지! 세부 베스트 액티비티.", keywords: ["세부에서 뭐하지", "세부 액티비티", "세부에서 할 것", "세부 투어", "세부 다이빙"] },
  { slug: "singapore", cityCode: "SIN", cityKo: "싱가포르", countryKo: "싱가포르", description: "마리나베이 야경, 가든스바이더베이, 센토사 놀이기구까지! 싱가포르 액티비티 총정리.", keywords: ["싱가포르에서 뭐하지", "싱가포르 액티비티", "싱가포르에서 할 것", "싱가포르 투어"] },
  { slug: "bali", cityCode: "DPS", cityKo: "발리", countryKo: "인도네시아", description: "우붓 라이스테라스, 서핑, 울루와뚜 선셋 댄스까지! 발리에서 즐기는 베스트 액티비티.", keywords: ["발리에서 뭐하지", "발리 액티비티", "발리에서 할 것", "발리 투어", "발리 서핑"] },
  { slug: "chiangmai", cityCode: "CNX", cityKo: "치앙마이", countryKo: "태국", description: "도이수텝 일출, 코끼리 보호소, 야시장 쿠킹클래스까지! 치앙마이 액티비티 모음.", keywords: ["치앙마이에서 뭐하지", "치앙마이 액티비티", "치앙마이에서 할 것", "치앙마이 투어"] },
  { slug: "phuket", cityCode: "HKT", cityKo: "푸켓", countryKo: "태국", description: "피피섬 투어, 팡아만 카약, 파통 나이트라이프까지! 푸켓에서 할 것 총정리.", keywords: ["푸켓에서 뭐하지", "푸켓 액티비티", "푸켓에서 할 것", "푸켓 투어", "피피섬 투어"] },
  { slug: "hochiminh", cityCode: "SGN", cityKo: "호치민", countryKo: "베트남", description: "메콩델타 크루즈, 쿠치터널 탐방, 벤탄시장 먹거리까지! 호치민 베스트 액티비티.", keywords: ["호치민에서 뭐하지", "호치민 액티비티", "호치민에서 할 것", "호치민 투어", "메콩델타 투어"] },
  { slug: "kualalumpur", cityCode: "KUL", cityKo: "쿠알라룸푸르", countryKo: "말레이시아", description: "페트로나스 트윈타워 전망대, 바투동굴, 알로스트리트 야시장까지! 쿠알라룸푸르 액티비티.", keywords: ["쿠알라룸푸르에서 뭐하지", "쿠알라룸푸르 액티비티", "쿠알라룸푸르에서 할 것", "쿠알라룸푸르 투어"] },
  { slug: "kotakinabalu", cityCode: "BKI", cityKo: "코타키나발루", countryKo: "말레이시아", description: "키나발루산 트레킹, 선셋 크루즈, 섬 호핑까지! 코타키나발루 베스트 액티비티.", keywords: ["코타키나발루에서 뭐하지", "코타키나발루 액티비티", "코타키나발루에서 할 것", "코타키나발루 투어"] },
  { slug: "manila", cityCode: "MNL", cityKo: "마닐라", countryKo: "필리핀", description: "인트라무로스 역사투어, 리잘공원, 마닐라 맛집 투어까지! 마닐라에서 할 것 총정리.", keywords: ["마닐라에서 뭐하지", "마닐라 액티비티", "마닐라에서 할 것", "마닐라 투어"] },
  { slug: "siemreap", cityCode: "REP", cityKo: "시엠립", countryKo: "캄보디아", description: "앙코르와트 일출, 톤레삽 수상마을, 캄보디아 쿠킹클래스까지! 시엠립 액티비티 모음.", keywords: ["시엠립에서 뭐하지", "시엠립 액티비티", "시엠립에서 할 것", "앙코르와트 투어", "시엠립 투어"] },
  // 중화권
  { slug: "taipei", cityCode: "TPE", cityKo: "타이베이", countryKo: "대만", description: "지우펀 골목 탐방, 야시장 먹방, 타이베이 101 전망대까지! 타이베이 베스트 액티비티.", keywords: ["타이베이에서 뭐하지", "타이베이 액티비티", "타이베이에서 할 것", "대만 액티비티", "대만 투어"] },
  { slug: "hongkong", cityCode: "HKG", cityKo: "홍콩", countryKo: "홍콩", description: "빅토리아 피크 야경, 딤섬 투어, 란타우섬 케이블카까지! 홍콩에서 할 것 총정리.", keywords: ["홍콩에서 뭐하지", "홍콩 액티비티", "홍콩에서 할 것", "홍콩 투어"] },
  { slug: "macau", cityCode: "MFM", cityKo: "마카오", countryKo: "마카오", description: "세나도 광장 산책, 번지점프, 카지노 체험까지! 마카오에서 즐기는 베스트 액티비티.", keywords: ["마카오에서 뭐하지", "마카오 액티비티", "마카오에서 할 것", "마카오 투어"] },
  // 중국
  { slug: "beijing", cityCode: "PEK", cityKo: "베이징", countryKo: "중국", description: "만리장성 트레킹, 자금성 가이드투어, 후통 골목 탐방까지! 베이징 액티비티 총정리.", keywords: ["베이징에서 뭐하지", "베이징 액티비티", "베이징에서 할 것", "베이징 투어", "만리장성 투어"] },
  { slug: "shanghai", cityCode: "PVG", cityKo: "상하이", countryKo: "중국", description: "와이탄 야경, 동방명주 전망대, 주자각 수향마을까지! 상하이에서 할 것 총정리.", keywords: ["상하이에서 뭐하지", "상하이 액티비티", "상하이에서 할 것", "상하이 투어"] },
  { slug: "qingdao", cityCode: "TAO", cityKo: "칭다오", countryKo: "중국", description: "잔교 해변 산책, 칭다오 맥주박물관, 팔대관 유럽풍 거리까지! 칭다오 베스트 액티비티.", keywords: ["칭다오에서 뭐하지", "칭다오 액티비티", "칭다오에서 할 것", "칭다오 투어"] },
  { slug: "dalian", cityCode: "DLC", cityKo: "다롄", countryKo: "중국", description: "싱하이광장 야경, 해산물 투어, 러시아풍 거리 산책까지! 다롄에서 할 것 총정리.", keywords: ["다롄에서 뭐하지", "다롄 액티비티", "다롄에서 할 것", "다롄 투어"] },
  // 대만 추가
  { slug: "kaohsiung", cityCode: "KHH", cityKo: "가오슝", countryKo: "대만", description: "연지담 용호탑, 보얼예술특구, 치진섬 페리 투어까지! 가오슝 베스트 액티비티.", keywords: ["가오슝에서 뭐하지", "가오슝 액티비티", "가오슝에서 할 것", "대만 투어"] },
  // 동남아 추가
  { slug: "jakarta", cityCode: "CGK", cityKo: "자카르타", countryKo: "인도네시아", description: "모나스 전망대, 코타투아 올드타운, 천섬 아일랜드 호핑까지! 자카르타 액티비티 모음.", keywords: ["자카르타에서 뭐하지", "자카르타 액티비티", "자카르타에서 할 것", "자카르타 투어"] },
  { slug: "phnompenh", cityCode: "PNH", cityKo: "프놈펜", countryKo: "캄보디아", description: "왕궁 투어, 실버 파고다, 메콩강 선셋 크루즈까지! 프놈펜에서 할 것 총정리.", keywords: ["프놈펜에서 뭐하지", "프놈펜 액티비티", "프놈펜에서 할 것", "캄보디아 투어"] },
  { slug: "vientiane", cityCode: "VTE", cityKo: "비엔티안", countryKo: "라오스", description: "파탓루앙 사원, 빠뚜싸이 전망대, 메콩강변 야시장까지! 비엔티안 베스트 액티비티.", keywords: ["비엔티안에서 뭐하지", "비엔티안 액티비티", "라오스에서 할 것", "라오스 투어"] },
  // 남아시아
  { slug: "delhi", cityCode: "DEL", cityKo: "델리", countryKo: "인도", description: "타지마할 당일투어, 레드포트, 꾸뜹미나르 탐방까지! 델리에서 할 것 총정리.", keywords: ["델리에서 뭐하지", "델리 액티비티", "인도에서 할 것", "타지마할 투어", "인도 투어"] },
  { slug: "colombo", cityCode: "CMB", cityKo: "콜롬보", countryKo: "스리랑카", description: "갈레페이스 선셋, 실론티 농장 투어, 국립박물관까지! 콜롬보 베스트 액티비티.", keywords: ["콜롬보에서 뭐하지", "콜롬보 액티비티", "스리랑카에서 할 것", "스리랑카 투어"] },
  { slug: "kathmandu", cityCode: "KTM", cityKo: "카트만두", countryKo: "네팔", description: "히말라야 트레킹, 더르바르 광장, 스와얌부나트 사원까지! 카트만두에서 할 것 총정리.", keywords: ["카트만두에서 뭐하지", "카트만두 액티비티", "네팔에서 할 것", "히말라야 트레킹", "네팔 투어"] },
  // 중동
  { slug: "dubai", cityCode: "DXB", cityKo: "두바이", countryKo: "아랍에미리트", description: "사막 사파리, 부르즈 할리파 전망대, 스카이다이빙까지! 두바이에서 즐기는 극한 액티비티.", keywords: ["두바이에서 뭐하지", "두바이 액티비티", "두바이에서 할 것", "두바이 투어", "사막 사파리"] },
  { slug: "istanbul", cityCode: "IST", cityKo: "이스탄불", countryKo: "튀르키예", description: "아야소피아, 블루모스크, 그랜드 바자르 쇼핑, 보스포러스 크루즈까지! 이스탄불 액티비티 모음.", keywords: ["이스탄불에서 뭐하지", "이스탄불 액티비티", "이스탄불에서 할 것", "이스탄불 투어", "튀르키예 투어"] },
  // 몰디브
  { slug: "maldives", cityCode: "MLE", cityKo: "몰디브", countryKo: "몰디브", description: "스노클링, 돌핀 크루즈, 수상 빌라 체험까지! 몰디브에서 즐기는 꿈같은 액티비티.", keywords: ["몰디브에서 뭐하지", "몰디브 액티비티", "몰디브에서 할 것", "몰디브 투어", "몰디브 스노클링"] },
  // 유럽
  { slug: "paris", cityCode: "PAR", cityKo: "파리", countryKo: "프랑스", description: "에펠탑 야경, 루브르 가이드투어, 센강 크루즈, 와인 테이스팅까지! 파리 베스트 액티비티.", keywords: ["파리에서 뭐하지", "파리 액티비티", "파리에서 할 것", "파리 투어", "파리 체험"] },
  { slug: "london", cityCode: "LON", cityKo: "런던", countryKo: "영국", description: "대영박물관 가이드투어, 해리포터 스튜디오, 런던아이까지! 런던에서 할 것 총정리.", keywords: ["런던에서 뭐하지", "런던 액티비티", "런던에서 할 것", "런던 투어", "런던 체험"] },
  { slug: "rome", cityCode: "FCO", cityKo: "로마", countryKo: "이탈리아", description: "콜로세움 입장, 바티칸 가이드투어, 로마 푸드 투어까지! 로마에서 즐기는 베스트 액티비티.", keywords: ["로마에서 뭐하지", "로마 액티비티", "로마에서 할 것", "로마 투어", "바티칸 투어"] },
  { slug: "barcelona", cityCode: "BCN", cityKo: "바르셀로나", countryKo: "스페인", description: "사그라다 파밀리아, 구엘공원, 플라멩코 공연, 타파스 투어까지! 바르셀로나 액티비티 모음.", keywords: ["바르셀로나에서 뭐하지", "바르셀로나 액티비티", "바르셀로나에서 할 것", "바르셀로나 투어"] },
  { slug: "amsterdam", cityCode: "AMS", cityKo: "암스테르담", countryKo: "네덜란드", description: "운하 크루즈, 반 고흐 미술관, 안네 프랑크의 집까지! 암스테르담 베스트 액티비티.", keywords: ["암스테르담에서 뭐하지", "암스테르담 액티비티", "암스테르담에서 할 것", "암스테르담 투어"] },
  { slug: "prague", cityCode: "PRG", cityKo: "프라하", countryKo: "체코", description: "카를교 산책, 프라하성 투어, 체코 맥주 테이스팅까지! 프라하에서 할 것 총정리.", keywords: ["프라하에서 뭐하지", "프라하 액티비티", "프라하에서 할 것", "프라하 투어"] },
  { slug: "budapest", cityCode: "BUD", cityKo: "부다페스트", countryKo: "헝가리", description: "국회의사당 야경 크루즈, 세체니 온천, 어부의 요새까지! 부다페스트 베스트 액티비티.", keywords: ["부다페스트에서 뭐하지", "부다페스트 액티비티", "부다페스트에서 할 것", "부다페스트 투어", "헝가리 투어"] },
  { slug: "frankfurt", cityCode: "FRA", cityKo: "프랑크푸르트", countryKo: "독일", description: "뢰머광장 산책, 마인강 크루즈, 라인강 와인 투어까지! 프랑크푸르트에서 할 것 총정리.", keywords: ["프랑크푸르트에서 뭐하지", "프랑크푸르트 액티비티", "독일에서 할 것", "독일 투어"] },
  { slug: "vienna", cityCode: "VIE", cityKo: "빈", countryKo: "오스트리아", description: "쇤브룬 궁전 투어, 오페라 감상, 카페 문화 체험까지! 빈에서 즐기는 베스트 액티비티.", keywords: ["빈에서 뭐하지", "빈 액티비티", "비엔나에서 할 것", "빈 투어", "비엔나 투어"] },
  { slug: "zurich", cityCode: "ZRH", cityKo: "취리히", countryKo: "스위스", description: "융프라우 등반, 호수 크루즈, 구시가지 산책까지! 취리히에서 즐기는 알프스 액티비티.", keywords: ["취리히에서 뭐하지", "취리히 액티비티", "스위스에서 할 것", "스위스 투어", "융프라우 투어"] },
  { slug: "lisbon", cityCode: "LIS", cityKo: "리스본", countryKo: "포르투갈", description: "트램 28번 투어, 벨렘탑, 파두 공연, 신트라 당일치기까지! 리스본 베스트 액티비티.", keywords: ["리스본에서 뭐하지", "리스본 액티비티", "리스본에서 할 것", "리스본 투어", "포르투갈 투어"] },
  { slug: "athens", cityCode: "ATH", cityKo: "아테네", countryKo: "그리스", description: "아크로폴리스 가이드투어, 플라카 골목 산책, 그리스 요리 클래스까지! 아테네 액티비티 모음.", keywords: ["아테네에서 뭐하지", "아테네 액티비티", "아테네에서 할 것", "아테네 투어", "그리스 투어"] },
  { slug: "helsinki", cityCode: "HEL", cityKo: "헬싱키", countryKo: "핀란드", description: "사우나 체험, 오로라 투어, 디자인 디스트릭트 산책까지! 헬싱키에서 할 것 총정리.", keywords: ["헬싱키에서 뭐하지", "헬싱키 액티비티", "헬싱키에서 할 것", "핀란드 투어", "오로라 투어"] },
  // 미주/태평양
  { slug: "honolulu", cityCode: "HNL", cityKo: "호놀룰루", countryKo: "미국", description: "와이키키 서핑, 다이아몬드 헤드 트레킹, 하나우마 베이 스노클링까지! 하와이 베스트 액티비티.", keywords: ["하와이에서 뭐하지", "호놀룰루 액티비티", "하와이에서 할 것", "하와이 투어", "하와이 서핑"] },
  { slug: "guam", cityCode: "GUM", cityKo: "괌", countryKo: "미국", description: "사격 체험, 투몬비치 스노클링, 정글 트레킹까지! 괌에서 즐기는 베스트 액티비티.", keywords: ["괌에서 뭐하지", "괌 액티비티", "괌에서 할 것", "괌 투어", "괌 체험"] },
  { slug: "saipan", cityCode: "SPN", cityKo: "사이판", countryKo: "사이판", description: "마나가하섬 스노클링, 그로토 다이빙, 정글 ATV까지! 사이판 베스트 액티비티.", keywords: ["사이판에서 뭐하지", "사이판 액티비티", "사이판에서 할 것", "사이판 투어", "사이판 다이빙"] },
  { slug: "losangeles", cityCode: "LAX", cityKo: "로스앤젤레스", countryKo: "미국", description: "할리우드 투어, 유니버설 스튜디오, 산타모니카 자전거까지! LA에서 할 것 총정리.", keywords: ["LA에서 뭐하지", "로스앤젤레스 액티비티", "LA에서 할 것", "LA 투어"] },
  { slug: "newyork", cityCode: "JFK", cityKo: "뉴욕", countryKo: "미국", description: "브로드웨이 뮤지컬, 자유의 여신상, 센트럴파크 투어까지! 뉴욕에서 즐기는 베스트 액티비티.", keywords: ["뉴욕에서 뭐하지", "뉴욕 액티비티", "뉴욕에서 할 것", "뉴욕 투어", "브로드웨이"] },
  { slug: "sanfrancisco", cityCode: "SFO", cityKo: "샌프란시스코", countryKo: "미국", description: "알카트라즈 투어, 골든게이트 자전거, 피어39까지! 샌프란시스코에서 할 것 총정리.", keywords: ["샌프란시스코에서 뭐하지", "샌프란시스코 액티비티", "샌프란시스코에서 할 것", "샌프란시스코 투어"] },
  { slug: "lasvegas", cityCode: "LAS", cityKo: "라스베이거스", countryKo: "미국", description: "그랜드캐니언 투어, 시르크 뒤 솔레이유, 헬리콥터 야경까지! 라스베이거스 베스트 액티비티.", keywords: ["라스베이거스에서 뭐하지", "라스베이거스 액티비티", "라스베이거스에서 할 것", "그랜드캐니언 투어"] },
  { slug: "vancouver", cityCode: "YVR", cityKo: "밴쿠버", countryKo: "캐나다", description: "스탠리파크 자전거, 그랜빌 아일랜드 마켓, 캐필라노 현수교까지! 밴쿠버 베스트 액티비티.", keywords: ["밴쿠버에서 뭐하지", "밴쿠버 액티비티", "캐나다에서 할 것", "캐나다 투어"] },
  { slug: "cancun", cityCode: "CUN", cityKo: "칸쿤", countryKo: "멕시코", description: "세노테 다이빙, 치첸이트사 투어, 카리브해 스노클링까지! 칸쿤에서 즐기는 베스트 액티비티.", keywords: ["칸쿤에서 뭐하지", "칸쿤 액티비티", "칸쿤에서 할 것", "칸쿤 투어", "세노테 다이빙"] },
  // 오세아니아
  { slug: "sydney", cityCode: "SYD", cityKo: "시드니", countryKo: "호주", description: "오페라하우스 투어, 하버브릿지 클라이밍, 본다이비치 서핑까지! 시드니 베스트 액티비티.", keywords: ["시드니에서 뭐하지", "시드니 액티비티", "시드니에서 할 것", "시드니 투어", "호주 액티비티"] },
  { slug: "melbourne", cityCode: "MEL", cityKo: "멜버른", countryKo: "호주", description: "그레이트 오션로드 투어, 레인웨이 아트, 커피 투어까지! 멜버른에서 할 것 총정리.", keywords: ["멜버른에서 뭐하지", "멜버른 액티비티", "멜버른에서 할 것", "멜버른 투어", "그레이트오션로드"] },
  { slug: "auckland", cityCode: "AKL", cityKo: "오클랜드", countryKo: "뉴질랜드", description: "스카이점프, 와이헤케섬 와이너리, 반지의 제왕 호빗투어까지! 오클랜드 베스트 액티비티.", keywords: ["오클랜드에서 뭐하지", "오클랜드 액티비티", "뉴질랜드에서 할 것", "뉴질랜드 투어", "호빗 투어"] },
  // 아프리카
  { slug: "cairo", cityCode: "CAI", cityKo: "카이로", countryKo: "이집트", description: "피라미드 낙타 투어, 나일강 크루즈, 이집트 박물관 가이드까지! 카이로 베스트 액티비티.", keywords: ["카이로에서 뭐하지", "카이로 액티비티", "이집트에서 할 것", "이집트 투어", "피라미드 투어"] },
];

export const destinationBySlug = Object.fromEntries(
  destinations.map((d) => [d.slug, d])
);
