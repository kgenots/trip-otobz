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
  dropPct: number | null; // 7일 평균 대비 % (음수 = 하락)
  daysAgo: number;
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

    // Per arr_city: cheapest record in window + 7일 평균 참고값
    const rows = await pool.query<{
      arr_city: string;
      min_price: number;
      period: number;
      collected_at: Date;
      avg7: string | null;
    }>(
      `WITH cheapest AS (
         SELECT DISTINCT ON (arr_city)
           arr_city, min_price, period, collected_at
         FROM flight_price_history
         WHERE collected_at >= CURRENT_DATE - INTERVAL '${WINDOW_DAYS} days'
         ORDER BY arr_city, min_price ASC, collected_at DESC
       ),
       avg7d AS (
         SELECT arr_city, AVG(min_price) AS avg7
         FROM flight_price_history
         WHERE collected_at >= CURRENT_DATE - INTERVAL '7 days'
         GROUP BY arr_city
       )
       SELECT c.arr_city, c.min_price, c.period, c.collected_at,
              (a.avg7)::text AS avg7
       FROM cheapest c
       LEFT JOIN avg7d a USING (arr_city)`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Collapse to per-slug cheapest (multiple airport codes → one city)
    const bySlug: Record<string, TopDeal> = {};
    for (const r of rows.rows) {
      const slug = ROUTE_TO_SLUG[r.arr_city];
      if (!slug) continue;
      const city = cityBySlug[slug];
      if (!city) continue;

      const avg7 = r.avg7 ? parseFloat(r.avg7) : null;
      const dropPct = avg7 && avg7 > 0
        ? Math.round(((r.min_price - avg7) / avg7) * 1000) / 10
        : null;

      const collectedDate = new Date(r.collected_at);
      collectedDate.setHours(0, 0, 0, 0);
      const daysAgo = Math.max(0, Math.round((today.getTime() - collectedDate.getTime()) / 86400000));

      const deal: TopDeal = {
        arrCode: r.arr_city,
        slug,
        cityKo: city.cityKo,
        emoji: city.emoji,
        minPrice: r.min_price,
        period: r.period,
        collectedAt: r.collected_at.toISOString().split("T")[0],
        dropPct,
        daysAgo,
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
