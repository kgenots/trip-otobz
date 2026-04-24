import pool, { ensurePricePulseTables } from "@/lib/db";
import { ROUTE_TO_SLUG } from "@/lib/price-routes";
import { cityBySlug } from "@/data/cities";

export type TopDeal = {
  routeCode: string;
  slug: string;
  cityKo: string;
  emoji: string;
  minPrice: number;
  period: number;
  collectedAt: string;
};

export type HeroSummary = {
  top3: TopDeal[];
  bySlug: Record<string, TopDeal>;
  stats: { activeAlerts: number; trackedRoutes: number };
  generatedAt: string;
};

export async function computeHeroSummary(): Promise<HeroSummary> {
  const empty: HeroSummary = {
    top3: [],
    bySlug: {},
    stats: { activeAlerts: 0, trackedRoutes: 0 },
    generatedAt: new Date().toISOString(),
  };

  try {
    await ensurePricePulseTables();

    const topRows = await pool.query<{
      route_code: string;
      min_price: number;
      period: number;
      collected_at: Date;
    }>(
      `SELECT DISTINCT ON (route_code)
         route_code,
         price AS min_price,
         period,
         collected_at
       FROM price_history
       WHERE collected_at >= CURRENT_DATE - INTERVAL '7 days'
       ORDER BY route_code, price ASC, collected_at DESC`
    );

    const deals: TopDeal[] = [];
    for (const r of topRows.rows) {
      const slug = ROUTE_TO_SLUG[r.route_code];
      if (!slug) continue;
      const city = cityBySlug[slug];
      if (!city) continue;
      deals.push({
        routeCode: r.route_code,
        slug,
        cityKo: city.cityKo,
        emoji: city.emoji,
        minPrice: r.min_price,
        period: r.period,
        collectedAt: r.collected_at.toISOString().split("T")[0],
      });
    }

    deals.sort((a, b) => a.minPrice - b.minPrice);

    const bySlug: Record<string, TopDeal> = {};
    for (const d of deals) bySlug[d.slug] = d;

    const alertsRes = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM price_alerts WHERE is_active = true`
    );
    const activeAlerts = parseInt(alertsRes.rows[0]?.count ?? "0", 10);

    return {
      top3: deals.slice(0, 3),
      bySlug,
      stats: { activeAlerts, trackedRoutes: deals.length },
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return empty;
  }
}
