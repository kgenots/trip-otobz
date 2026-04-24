import pool, { ensureFlightTable, ensurePricePulseTables } from "@/lib/db";
import { ROUTE_TO_SLUG } from "@/lib/price-routes";
import { cityBySlug } from "@/data/cities";

export type TopDeal = {
  arrCode: string;
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
  stats: { activeAlerts: number; trackedCities: number };
  generatedAt: string;
};

const WINDOW_DAYS = 14;

export async function computeHeroSummary(): Promise<HeroSummary> {
  const empty: HeroSummary = {
    top3: [],
    bySlug: {},
    stats: { activeAlerts: 0, trackedCities: 0 },
    generatedAt: new Date().toISOString(),
  };

  try {
    await ensureFlightTable();

    // Per arr_city, pick cheapest record in window
    const rows = await pool.query<{
      arr_city: string;
      min_price: number;
      period: number;
      collected_at: Date;
    }>(
      `SELECT DISTINCT ON (arr_city)
         arr_city,
         min_price,
         period,
         collected_at
       FROM flight_price_history
       WHERE collected_at >= CURRENT_DATE - INTERVAL '${WINDOW_DAYS} days'
       ORDER BY arr_city, min_price ASC, collected_at DESC`
    );

    // Collapse to per-slug cheapest (multiple airport codes → one city)
    const bySlug: Record<string, TopDeal> = {};
    for (const r of rows.rows) {
      const slug = ROUTE_TO_SLUG[r.arr_city];
      if (!slug) continue;
      const city = cityBySlug[slug];
      if (!city) continue;
      const deal: TopDeal = {
        arrCode: r.arr_city,
        slug,
        cityKo: city.cityKo,
        emoji: city.emoji,
        minPrice: r.min_price,
        period: r.period,
        collectedAt: r.collected_at.toISOString().split("T")[0],
      };
      const existing = bySlug[slug];
      if (!existing || deal.minPrice < existing.minPrice) {
        bySlug[slug] = deal;
      }
    }

    const deals = Object.values(bySlug).sort((a, b) => a.minPrice - b.minPrice);
    const top3 = deals.slice(0, 3);

    // Active alerts count (separate table, optional)
    let activeAlerts = 0;
    try {
      await ensurePricePulseTables();
      const alertsRes = await pool.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM price_alerts WHERE is_active = true`
      );
      activeAlerts = parseInt(alertsRes.rows[0]?.count ?? "0", 10);
    } catch {
      // alerts table optional
    }

    return {
      top3,
      bySlug,
      stats: { activeAlerts, trackedCities: deals.length },
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return empty;
  }
}
