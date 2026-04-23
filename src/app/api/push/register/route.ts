import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { subscription, userId, routeCode } = body as {
    subscription: any;
    userId: string;
    routeCode?: string;
  };

  if (!subscription || !userId) {
    return NextResponse.json({ error: "Missing subscription or userId" }, { status: 400 });
  }

  try {
    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, route_code)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (endpoint) DO UPDATE
         SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, route_code = EXCLUDED.route_code, is_active = true`,
      [userId, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, routeCode || null]
    );

    // Try to send test push (will fail if serviceWorker not ready, but that's ok)
    return NextResponse.json({ success: true, message: "Push registered" });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
