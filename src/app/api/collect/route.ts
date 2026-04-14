import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTable } from "@/lib/db";
import { getFlightBulkLowest } from "@/lib/api";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.COLLECT_API_KEY || key !== process.env.COLLECT_API_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    await ensureTable();
    const data = await getFlightBulkLowest("ICN", 5);
    const today = new Date().toISOString().split("T")[0];
    let count = 0;

    for (const item of data) {
      await pool.query(
        `INSERT INTO flight_price_history (collected_at, dep_city, arr_city, min_price, period)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (collected_at, dep_city, arr_city, period)
         DO UPDATE SET min_price = LEAST(flight_price_history.min_price, $4)`,
        [today, item.fromCity, item.toCity, item.totalPrice, item.period ?? 5]
      );
      count++;
    }

    return NextResponse.json({ collected: count, date: today });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
