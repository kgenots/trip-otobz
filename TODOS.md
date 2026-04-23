# TODOS — trip-otobz

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
