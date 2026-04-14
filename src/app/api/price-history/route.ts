import { NextRequest, NextResponse } from "next/server";
import pool, { ensureTable } from "@/lib/db";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");
  const days = parseInt(req.nextUrl.searchParams.get("days") || "90", 10);

  if (!city) {
    return NextResponse.json({ error: "city parameter required" }, { status: 400 });
  }

  try {
    await ensureTable();
    const result = await pool.query(
      `SELECT collected_at AS date, min_price AS price
       FROM flight_price_history
       WHERE arr_city = $1 AND dep_city = 'ICN'
       AND collected_at >= CURRENT_DATE - $2::int
       ORDER BY collected_at ASC`,
      [city, days]
    );

    return NextResponse.json({
      city,
      data: result.rows.map((r) => ({
        date: r.date.toISOString().split("T")[0],
        price: r.price,
      })),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
