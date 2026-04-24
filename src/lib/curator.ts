import { computeHeroSummary, type TopDeal } from "@/lib/hero-summary";

export type Companion = "solo" | "friends";
export type Duration = "short" | "mid" | "long"; // 1-3 / 4-6 / 7+
export type BudgetTier = "budget" | "mid" | "premium"; // ≤40 / ≤80 / ∞ (단위: 만원)

export type CurateInput = {
  companion: Companion;
  budget: BudgetTier;
  duration: Duration;
};

export type CuratedPick = {
  deal: TopDeal;
  reason: string;
  score: number;
};

export type CurateResult = {
  picks: CuratedPick[];
  filters: CurateInput;
  generatedAt: string;
};

// 동행 가중치 — 특정 슬러그에 +점수
const COMPANION_BONUS: Record<Companion, Record<string, number>> = {
  solo: {
    tokyo: 3, osaka: 2, fukuoka: 2, taipei: 3, hongkong: 2,
    sapporo: 1, kyoto: 2, okinawa: 1, singapore: 2, barcelona: 1,
  },
  friends: {
    bangkok: 3, bali: 3, osaka: 2, lasvegas: 3, danang: 2,
    cebu: 2, phuket: 2, hochiminh: 1, guam: 2, saipan: 1,
  },
};

// 기간 가중치 — 거리 기반
const DURATION_BONUS: Record<Duration, (slug: string) => number> = {
  short: (slug) => {
    // 일본·중화권·가까운 아시아 선호
    if (["tokyo", "osaka", "fukuoka", "sapporo", "okinawa", "nagoya", "kyoto"].includes(slug)) return 2;
    if (["taipei", "hongkong", "macau", "shanghai", "beijing"].includes(slug)) return 2;
    return 0;
  },
  mid: (slug) => {
    // 동남아·오세아니아 단거리
    if (["bangkok", "danang", "cebu", "bali", "singapore", "hanoi", "hochiminh", "phuket", "kotakinabalu", "kualalumpur", "siemreap"].includes(slug)) return 2;
    if (["guam", "saipan"].includes(slug)) return 1;
    return 0;
  },
  long: (slug) => {
    // 유럽·미주·오세아니아
    if (["paris", "london", "rome", "barcelona", "amsterdam", "prague", "vienna", "zurich", "lisbon", "athens", "helsinki"].includes(slug)) return 2;
    if (["newyork", "losangeles", "sanfrancisco", "lasvegas", "hawaii", "cancun"].includes(slug)) return 2;
    if (["sydney", "melbourne", "auckland"].includes(slug)) return 1;
    return 0;
  },
};

function budgetCapKrw(tier: BudgetTier): number {
  if (tier === "budget") return 400000;
  if (tier === "mid") return 800000;
  return Number.MAX_SAFE_INTEGER;
}

function reasonFor(slug: string, input: CurateInput, deal: TopDeal): string {
  const parts: string[] = [];
  const companionBonus = COMPANION_BONUS[input.companion][slug] ?? 0;
  if (companionBonus >= 2) {
    parts.push(input.companion === "solo" ? "혼여 안전·편의성 강함" : "친구끼리 놀거리 풍부");
  }
  const durBonus = DURATION_BONUS[input.duration](slug);
  if (durBonus >= 2) {
    if (input.duration === "short") parts.push("단거리 주말 코스 최적");
    else if (input.duration === "mid") parts.push("4-6박 적정 거리");
    else parts.push("장거리 일정 가치");
  }
  parts.push(`₩${deal.minPrice.toLocaleString("ko-KR")} 최저가 확보`);
  return parts.join(" · ");
}

export async function curate(input: CurateInput): Promise<CurateResult> {
  const summary = await computeHeroSummary();
  const cap = budgetCapKrw(input.budget);

  const candidates: CuratedPick[] = [];
  for (const deal of Object.values(summary.bySlug)) {
    if (deal.minPrice > cap) continue;

    const companionScore = COMPANION_BONUS[input.companion][deal.slug] ?? 0;
    const durationScore = DURATION_BONUS[input.duration](deal.slug);

    // 가격 정규화 — 싸면 플러스 (cap 대비)
    const priceScore = cap === Number.MAX_SAFE_INTEGER
      ? 0
      : Math.max(0, 3 * (1 - deal.minPrice / cap));

    const score = companionScore * 2 + durationScore * 2 + priceScore;
    if (score <= 0) continue;

    candidates.push({
      deal,
      score,
      reason: reasonFor(deal.slug, input, deal),
    });
  }

  candidates.sort((a, b) => b.score - a.score || a.deal.minPrice - b.deal.minPrice);
  const picks = candidates.slice(0, 3);

  return {
    picks,
    filters: input,
    generatedAt: new Date().toISOString(),
  };
}
