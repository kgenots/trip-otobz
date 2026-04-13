# trip.otobz.com — 마이리얼트립 어필리에이트 여행 검색 서비스

## 컨셉
SVG 세계지도 기반 인터랙티브 여행 검색. 지도에서 나라/도시를 클릭하면 항공권·숙소·투어 정보를 조회.

## 기술 스택
- Next.js 15 (App Router, TypeScript)
- react-simple-maps + d3-geo (SVG 인터랙티브 맵)
- Tailwind CSS
- 이미 설치 완료

## API 정보

### Base URL & Auth
```
Base: https://partner-ext-api.myrealtrip.com
Auth: Authorization: Bearer {API_KEY}
Content-Type: application/json
All endpoints: POST
```

API 키는 환경변수 `MYREALTRIP_API_KEY`로 관리.

### 항공권 API

1. **캘린더 최저가** `POST /v1/products/flight/calendar`
   - Body: `{ depCityCd, arrCityCd, period(3~7), startDate, endDate }` (모두 필수)
   - Response: `{ data: [{ fromCity, toCity, departureDate, returnDate, totalPrice, airline, transfer, averagePrice, period }], meta: { totalCount } }`

2. **캘린더 윈도우 최저가** `POST /v1/products/flight/calendar/window`
   - 180일간 슬라이딩 윈도우. 국제선만.
   - Body: `{ depCityCd, arrCityCd, period(3~7) }` (모두 필수)
   - Response: 동일 구조

3. **다중 목적지 최저가** `POST /v1/products/flight/calendar/lowest`
   - 최대 50개 목적지. 국제선만.
   - Body: `{ depCityCd, arrCityCds(array, max 50), period(3~7) }` (모두 필수)
   - Response: 동일 구조

4. **전체 목적지 최저가** `POST /v1/products/flight/calendar/bulk-lowest` ⭐ 지도 핵심
   - Body: `{ depCityCd, period(3~7) }` (모두 필수)
   - Response: 동일 구조, totalCount ~694개 도시

### 숙소 API

1. **숙소 검색** `POST /v1/products/accommodation/search`
   - Body 필수: `{ keyword(도시명), checkIn, checkOut, adultCount }`
   - Body 옵션: `{ childCount, isDomestic, minPrice, maxPrice, order(price_asc|price_desc|review_desc), page(0~), size(1~50, default 20), regionId, starRating(threestar|fourstar|fivestar), stayPoi }`
   - Response: `{ data: { items: [{ itemId, itemName, salePrice, originalPrice, starRating, reviewScore, reviewCount }], totalCount, page, size } }`

### 투어티켓 API

1. **카테고리 목록** `POST /v1/products/tna/categories`
   - Body: `{ city(한글, 예: "오사카") }` (필수)
   - Response: `{ data: { categories: [{ name, value }], totalCount } }`

2. **상품 검색** `POST /v1/products/tna/search`
   - Body 필수: `{ keyword }`
   - Body 옵션: `{ category, city, minPrice, maxPrice, sort(price_asc|price_desc|review_score_desc|selling_count_desc), page(1~), perPage(default 20, max 100) }`
   - Response: `{ data: { items: [{ gid, itemName, description, salePrice, priceDisplay, category, reviewScore, reviewCount, imageUrl, productUrl, deepLink, tags }], totalCount, page, perPage, hasNextPage } }`

3. **상품 상세** `POST /v1/products/tna/detail`
   - Body: `{ gid }` (필수)
   - Response: `{ data: { gid, title, description, reviewScore, reviewCount, included, excluded, itineraries } }`

4. **옵션 조회** `POST /v1/products/tna/options`
   - Body: `{ gid, selectedDate(YYYY-MM-DD) }` (모두 필수)
   - Response: `{ data: { options: [{ id, name, availablePurchaseQuantity, currency, salePrice, units }], selectedDate, defaultOption } }`

## UX 설계

### 메인 페이지 (`/`)
1. 전체 화면 SVG 세계지도 (react-simple-maps)
2. 페이지 로드 시 `bulk-lowest` API 호출 → 도시코드를 국가에 매핑 → 가격 히트맵 (저렴=초록, 비쌈=빨강 그라데이션)
3. 상단: 출발지 선택 (기본 ICN), 여행기간 선택 (3~7일)
4. 나라 호버: 툴팁 ("태국 방콕 326,300원~")
5. 나라 클릭: 우측 사이드패널 슬라이드

### 사이드패널 (나라 클릭 시)
- 탭 3개: ✈️ 항공권 | 🏨 숙소 | 🎫 투어·티켓
- **항공권 탭**: 해당 국가 주요 도시 캘린더 최저가. 날짜별 가격 캘린더 UI.
- **숙소 탭**: 도시명 기반 검색. 필터 (가격, 성급, 정렬). 카드형 목록.
- **투어·티켓 탭**: 도시별 카테고리 → 검색. 카드형 목록. 이미지+가격+리뷰.
- 각 항목 클릭 → 마이리얼트립 링크(productUrl)로 이동 (새 탭, 어필리에이트)

### 도시코드 → 국가 매핑
IATA 도시코드(BKK, NRT 등)를 ISO 국가코드로 매핑하는 정적 데이터 필요.
`/src/data/city-country-map.ts` — 주요 도시 매핑 (최소 100개+)

### 디자인
- 다크 테마 기본
- 깔끔하고 모던한 UI
- 모바일 반응형 (지도는 터치 줌/패닝)
- 가격 포맷: 한국 원화 (₩ + 천단위 콤마)

## 파일 구조 (제안)
```
src/
  app/
    layout.tsx
    page.tsx           # 메인 (지도)
    globals.css
  components/
    WorldMap.tsx        # SVG 지도 컴포넌트
    SidePanel.tsx       # 우측 사이드패널
    FlightTab.tsx       # 항공권 탭
    AccommodationTab.tsx # 숙소 탭
    TourTab.tsx         # 투어·티켓 탭
    Tooltip.tsx         # 지도 툴팁
    PriceCalendar.tsx   # 날짜별 가격 캘린더
  lib/
    api.ts              # 마이리얼트립 API 클라이언트
  data/
    city-country-map.ts # IATA 도시코드 → 국가 매핑
  app/api/
    flights/route.ts    # API proxy routes
    accommodation/route.ts
    tours/route.ts
```

## 환경변수
```
MYREALTRIP_API_KEY=xxx
```

## 주의사항
- API 키는 서버사이드에서만 사용 (클라이언트 노출 금지)
- Next.js API Routes로 프록시
- 에러 핸들링: 429 (rate limit) 대응
- react-simple-maps는 React 19 peer dep 경고 있지만 동작함 (--legacy-peer-deps로 설치됨)
