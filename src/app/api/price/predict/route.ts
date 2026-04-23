import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

interface PricePoint {
  date: string;
  price: number;
  period: number;
}

/** Weighted Moving Average — heavier weight on recent prices */
function wma(prices: number[], window: number): number {
  const slice = prices.slice(-window);
  let weights = 0;
  let sum = 0;
  for (let i = 0; i < slice.length; i++) {
    const w = i + 1;
    sum += slice[i] * w;
    weights += w;
  }
  return Math.round(sum / weights);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const routeCode = searchParams.get("route");

  if (!routeCode) {
    return NextResponse.json({ error: "Missing route parameter" }, { status: 400 });
  }

  try {
    const rows = await pool.query(
      `SELECT price, period, collected_at
       FROM price_history
       WHERE route_code = $1
       ORDER BY collected_at DESC
       LIMIT 90`,
      [routeCode]
    );

    const history: PricePoint[] = rows.rows.map((r) => ({
      date: r.collected_at.toISOString().split("T")[0],
      price: r.price,
      period: r.period,
    }));

    if (history.length < 7) {
      return NextResponse.json({
        route: routeCode,
        prediction: null,
        insufficientData: true,
        count: history.length,
      });
    }

    const prices = history.map((h) => h.price).reverse();
    const prediction = wma(prices, Math.min(7, prices.length));

    const current = prices[prices.length - 1];
    const change = prediction - current;
    const changePercent = Math.round((change / current) * 100);
    const direction = changePercent < -2 ? "down" : changePercent > 2 ? "up" : "flat";

    return NextResponse.json({
      route: routeCode,
      prediction,
      current,
      change,
      changePercent,
      direction,
      dataPoints: history.length,
    });
  } catch {
    return NextResponse.json({ error: "DB error", route: routeCode }, { status: 500 });
  }
}
