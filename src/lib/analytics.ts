type GtagEventParams = Record<string, string | number | boolean | undefined>;

interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}

export function gaEvent(name: string, params: GtagEventParams = {}) {
  if (typeof window === "undefined") return;
  const w = window as WindowWithGtag;
  try {
    w.gtag?.("event", name, params);
  } catch {
    // no-op
  }
}

export interface AffiliateClickPayload {
  provider: string;
  product: string;
  city: string;
  region: string;
  stage: "browse" | "plan" | "book" | "unknown";
  placement: string;
  value_krw?: number;
  scroll_depth?: number;
  time_on_page_s?: number;
  session_pv?: number;
  source_page: string;
}

export function trackAffiliateClick(p: AffiliateClickPayload) {
  gaEvent("affiliate_click", {
    provider: p.provider,
    product: p.product,
    city: p.city,
    region: p.region,
    stage: p.stage,
    placement: p.placement,
    value_krw: p.value_krw,
    scroll_depth: p.scroll_depth,
    time_on_page_s: p.time_on_page_s,
    session_pv: p.session_pv,
    source_page: p.source_page,
  });
}

export function measureScrollDepth(): number {
  if (typeof window === "undefined") return 0;
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 100;
  return Math.min(100, Math.round((scrolled / max) * 100));
}
