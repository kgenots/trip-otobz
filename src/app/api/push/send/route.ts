import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (publicKey && privateKey) {
    webpush.setVapidDetails("mailto:admin@otobz.com", publicKey, privateKey);
  }
  const body = await req.json();
  const { routeCode, price, targetPrice } = body as {
    routeCode: string;
    price: number;
    targetPrice: number;
  };

  try {
    const subs = await pool.query(
      `SELECT endpoint, p256dh, auth FROM push_subscriptions
       WHERE route_code = $1 AND is_active = true`,
      [routeCode]
    );

    const results = await Promise.all(
      subs.rows.map(async (sub: any) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            JSON.stringify({
              title: "Price Drop Alert",
              body: `${routeCode}: ${price} won (target: ${targetPrice} won)`,
              icon: "/icon-192.png",
              data: { url: `/new/price?route=${routeCode}` },
            })
          );
          return { ok: true };
        } catch {
          return { ok: false };
        }
      })
    );

    const failed = results.filter((r) => !r.ok).length;
    return NextResponse.json({ sent: subs.rows.length - failed, failed, total: subs.rows.length });
  } catch {
    return NextResponse.json({ error: "Send error" }, { status: 500 });
  }
}
