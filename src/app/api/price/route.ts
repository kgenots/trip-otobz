import { NextRequest, NextResponse } from "next/server";
import pool, { ensurePricePulseTables } from "@/lib/db";

const ROUTE_TO_CITY: Record<string, string> = {
  BKK: "bangkok",
  NRT: "tokyo",
  CNX: "chiang mai",
  SGN: "ho chi minh",
  KUL: "kuala lumpur",
  RGN: "yangon",
  MNL: "manila",
  TPE: "taipei",
  SIN: "singapore",
  PEK: "beijing",
};

export async function GET(req: NextRequest) {
  try {
    await ensurePricePulseTables();
    const routes = await pool.query(
      `SELECT arr_city, arr_code, display_name, sort_order
       FROM price_routes
       WHERE is_active = true
       ORDER BY sort_order`
    );

    const routeList = rowsToRoutes(routes.rows);
    return NextResponse.json({ routes: routeList });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

function rowsToRoutes(rows: { arr_city: string; arr_code: string; display_name: string; sort_order: number }[]) {
  return rows.map((r) => ({
    code: r.arr_code,
    display: r.display_name || r.arr_city,
    city: ROUTE_TO_CITY[r.arr_code] || r.arr_city,
    sort: r.sort_order,
  }));
}
