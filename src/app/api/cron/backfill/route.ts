import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const config = { cron: "0 */6 * * *" };

interface FlightPrice {
  fromCity: string;
  toCity: string;
  period: number | null;
  departureDate: string;
  returnDate: string | null;
  totalPrice: number;
  airline: string | null;
  transfer: number | null;
  averagePrice: number | null;
}

const API_BASE = "https://partner-ext-api.myrealtrip.com";

async function fetchPrices(depCity: string, period: number): Promise<FlightPrice[]> {
  const apiKey = process.env.MYREALTRIP_API_KEY;
  if (!apiKey) throw new Error("MYREALTRIP_API_KEY not set");

  const res = await fetch(`${API_BASE}/v1/products/flight/calendar/bulk-lowest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ depCityCd: depCity, period }),
  });

  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

  const json = await res.json();
  if (json.result?.status !== 200) throw new Error(`API error: ${json.result?.message || "Unknown"}`);

  return json.data as FlightPrice[];
}

const CITY_TO_ROUTE: Record<string, string> = {
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

const PERIODS = [1, 7, 14, 30, 60, 90];

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== process.env.CRON_API_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS price_history (
      id SERIAL PRIMARY KEY,
      route_code VARCHAR(10) NOT NULL,
      price INTEGER NOT NULL,
      period INTEGER NOT NULL,
      collected_at DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(route_code, period, collected_at)
    )
  `);

  const today = new Date().toISOString().split("T")[0];
  let totalCount = 0;

  for (const route of Object.keys(CITY_TO_ROUTE)) {
    for (const period of PERIODS) {
      try {
        const results = await fetchPrices("ICN", period);
        const filtered = results.filter((f) => f.toCity.toUpperCase() === route && f.totalPrice > 0);

        if (filtered.length === 0) continue;

        const minPrice = Math.min(...filtered.map((f) => f.totalPrice));

        await pool.query(
          `INSERT INTO price_history (route_code, price, period, collected_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (route_code, period, collected_at)
           DO UPDATE SET price = LEAST(price_history.price, $2)`,
          [route, minPrice, period, today]
        );

        totalCount += filtered.length;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "unknown";
        console.error(`Backfill ${route} P${period}: ${msg}`);
      }
    }
  }

  return NextResponse.json({ collected: totalCount, date: today });
}
