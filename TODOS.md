# TODOS — otobz-trip

## [PRICE-PULSE-1] Price chart screen reader data table fallback

- **What:** Recharts chart에 `<figure>` + `<figcaption>` + hidden data table 패턴 적용
- **Why:** Screen reader users에게 차트 데이터를 접근 가능하게 함. WCAG 1.1.1 / 1.4.4
- **Pros:** a11y 점수 직접 상승. Lighthouse a11y 100점 유지
- **Cons:** chart 컴포넌트 complexity 증가. `sr-only` 클래스 필요
- **Context:** /plan-design-review Pass 6에서 발견. Recharts는 SVG base이라 canvas chart보다 SR-friendly
- **Depends on:** PRICE-PULSE-0 (Price Pulse MVP implementation)

## [PRICE-PULSE-2] Empty state copy design

- **What:** "Select a route to see prices" 와 "No alerts yet" empty state copy polish
- **Why:** Empty state는 feature. 따뜻하고 helpful해야 함. "No items found." 금지
- **Pros:** 첫 사용자 경험 개선. friction 감소
- **Cons:** i18n으로 7개 언어 확장 필요 (MVP 때는 ko/en만)
- **Context:** /plan-design-review Pass 2에서 발견

## [PRICE-PULSE-3] Reduced motion support

- **What:** `prefers-reduced-motion` 감지 → shimmer/skeleton animation disable
- **Why:** vestibular disorder 사용자 지원. WCAG 2.3.1
- **Pros:** 작은 change, 큰 impact. CSS media query 한 줄
- **Cons:** 없음
- **Context:** /plan-design-review Pass 6에서 명세

## [PRICE-PULSE-4] Route chip accessibility

- **What:** Route chips에 `role="button"` 또는 `<button>` 사용, `aria-selected` active state
- **Why:** Keyboard nav 필수. Tab으로 탐색 가능해야 함
- **Pros:** a11y score 유지. keyboard user experience
- **Cons:** chip 클릭 핸들러에 focus 관리 추가 필요
- **Context:** /plan-design-review Pass 6에서 명세, Pass 1의 horizontal scroll chip 레이아웃과 연결

## [GROWTH-1] GA4 affiliate_click 보드 + KPI 정의

- **What:** GA4 탐색에서 `affiliate_click` 이벤트 dashboard. provider×city×product 클릭률, 시간대별 CTR
- **Why:** 트래픽 100+ uv/일 도달 후 어떤 도시·상품이 가장 매출 잠재력 있는지 측정. 콘텐츠 가속 방향 결정
- **Pros:** 데이터 기반 콘텐츠 우선순위. low-CTR 키워드 줄이고 high-CTR 도시 더
- **Cons:** 트래픽 0~100 uv 시점에는 데이터 부족 → dashboard 빈 그래프. 시기상조 risk
- **Context:** /plan-ceo-review 2026-04-25 SELECTIVE EXPANSION. components/CoupangAffiliateLink + TravelInsuranceLink 가 이미 trackAffiliateClick 발사 중. provider=coupang, safetywing 잡힘
- **Effort estimate:** S (human team) → CC+gstack: S
- **Priority:** P2
- **Depends on / blocked by:** GROWTH-3 (트래픽 임계점 도달 후 의미)

## [GROWTH-2] 네이버 블로그 cross-post (manual 1편/주)

- **What:** trip.otobz blog 글 1편을 네이버 블로그에 manual 재게시 (요약 + 원문 링크)
- **Why:** 네이버는 한국 검색 점유율 60%+. trip.otobz가 신규 도메인 sandbox 통과 전까지 백링크 + 트래픽 시드. 자동화 불가 (네이버 OAuth + 수기 검수)
- **Pros:** 한국 organic 트래픽 1순위. 경쟁 낮은 도시별 long-tail 키워드 점유 가능
- **Cons:** 수동 1주 1편 = 부담. ROI 검증 (3개월) 후 지속 여부 결정. tistory 처럼 무리되면 stop
- **Context:** memory feedback_tistory_oauth.md (tistory 자동화 실패 학습). 네이버는 더 큰 시장이지만 같은 manual 한계
- **Effort estimate:** M (human team, 1주 30분) → CC+gstack: M (manual)
- **Priority:** P2
- **Depends on / blocked by:** 콘텐츠 50+ 편 발행 후 시작 (재게시할 풀 충분)

## [GROWTH-3] Pinterest 핀 + Reddit r/travel 시드

- **What:** EN 글 cover image 를 Pinterest 핀 1개/주, Reddit r/travel 또는 r/solotravel 자연 노출 (직접 광고 X, 답변에 링크)
- **Why:** 영어권 backlink + 글로벌 organic 진입. Pinterest 는 여행 검색 강함, Reddit 은 도메인 권위 시드
- **Pros:** 글로벌 USD CPC 시장 진입. 한국 의존 탈피 핵심 단계
- **Cons:** Reddit 스팸 처벌 (계정 ban). 자연 노출 = 답변 작성 manual + 시간. 효과 확률적
- **Context:** memory project_trip_otobz_traffic.md "커뮤니티 공유 단가 0원". EN content 30+ 편 발행 후 의미
- **Effort estimate:** L (human team, 주 1~2시간) → CC+gstack: L (manual)
- **Priority:** P3
- **Depends on / blocked by:** EN 콘텐츠 30+ 편 발행 후 (재공유할 풀 + 도메인 평판)
