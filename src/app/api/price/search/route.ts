import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const arrCode = searchParams.get("route");

  if (!arrCode) {
    return NextResponse.json({ error: "Missing route parameter" }, { status: 400 });
  }

  try {
    const rows = await pool.query(
      `SELECT ph.price, ph.period, ph.collected_at, pr.arr_city, pr.arr_code
       FROM price_history ph
       JOIN price_routes pr ON pr.arr_code = ph.route_code
       WHERE ph.route_code = $1
       ORDER BY ph.collected_at DESC
       LIMIT 90`,
      [arrCode]
    );

    const history = rows.rows.map((r) => ({
      date: r.collected_at.toISOString().split("T")[0],
      price: r.price,
      period: r.period,
      city: r.arr_city,
    }));

    return NextResponse.json({ route: arrCode, history, count: history.length });
  } catch {
    return NextResponse.json({ error: "DB error", route: arrCode }, { status: 500 });
  }
}
