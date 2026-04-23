import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const rows = await pool.query(
      `SELECT pa.*, pr.arr_city, pr.arr_code
       FROM price_alerts pa
       JOIN price_routes pr ON pr.arr_code = pa.route_code
       WHERE pa.is_active = true
       ORDER BY pa.created_at DESC`
    );
    return NextResponse.json({ alerts: rows.rows });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { route, email, name, targetPrice } = body as {
    route: string;
    email: string;
    name?: string;
    targetPrice: number;
  };

  if (!route || !email || !targetPrice) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO price_alerts (route_code, user_email, user_name, target_price)
       VALUES ($1, $2, $3, $4)
       RETURNING id, route_code, user_email, user_name, target_price, is_active`,
      [route, email, name || null, targetPrice]
    );

    return NextResponse.json({
      alert: result.rows[0],
      message: `Alert set for ${route}. We'll notify you when prices drop to ${targetPrice} won.`,
    });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
