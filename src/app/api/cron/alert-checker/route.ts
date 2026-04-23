import { NextResponse } from "next/server";
import webpush from "web-push";
import pool from "@/lib/db";

export const config = { cron: "0 * * * *" };

interface AlertRow {
  id: number;
  route_code: string;
  user_email: string;
  target_price: number;
}

interface SubRow {
  endpoint: string;
  p256dh: string;
  auth: string;
}

async function sendPush(sub: SubRow, routeCode: string, price: number, targetPrice: number) {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (publicKey && privateKey) {
    webpush.setVapidDetails("mailto:admin@otobz.com", publicKey, privateKey);
  }
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify({
        title: "Price Drop Alert",
        body: `${routeCode}: ${price.toLocaleString()} won (target: ${targetPrice.toLocaleString()} won)`,
        icon: "/icon-192.png",
        data: { url: `/new/price?route=${routeCode}` },
      })
    );
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== process.env.CRON_API_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const alerts = await pool.query<AlertRow>(
    `SELECT pa.id, pa.route_code, pa.user_email, pa.target_price
     FROM price_alerts pa
     WHERE pa.is_active = true AND pa.triggered_at IS NULL`
  );

  let pushed = 0;
  let checked = 0;

  for (const alert of alerts.rows) {
    const history = await pool.query(
      `SELECT price FROM price_history
       WHERE route_code = $1
       ORDER BY collected_at DESC, period DESC
       LIMIT 1`,
      [alert.route_code]
    );

    if (history.rows.length === 0) continue;

    checked++;

    const latestPrice = history.rows[0].price;
    if (latestPrice <= alert.target_price) {
      const subs = await pool.query<SubRow>(
        `SELECT endpoint, p256dh, auth FROM push_subscriptions
         WHERE route_code = $1 AND is_active = true`,
        [alert.route_code]
      );

      const allSubs = await pool.query<SubRow>(
        `SELECT endpoint, p256dh, auth FROM push_subscriptions
         WHERE route_code = $1 AND is_active = true
         UNION
         SELECT endpoint, p256dh, auth FROM push_subscriptions
         WHERE route_code IS NULL AND is_active = true`
      );

      if (allSubs.rows.length === 0) continue;

      const results = await Promise.all(
        allSubs.rows.map((sub) => sendPush(sub, alert.route_code, latestPrice, alert.target_price))
      );

      const successCount = results.filter((r) => r).length;
      if (successCount > 0) {
        await pool.query(
          `UPDATE price_alerts SET triggered_at = NOW() WHERE id = $1`,
          [alert.id]
        );
        pushed += successCount;
      }
    }
  }

  return NextResponse.json({ checked, pushed });
}
