import { NextRequest, NextResponse } from "next/server";
import { ensureActivitiesTable } from "@/lib/db";
import { syncMyrealtrip } from "@/lib/sync-myrealtrip";
import { syncAccommodation } from "@/lib/sync-accommodation";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.COLLECT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const source = req.nextUrl.searchParams.get("source") || "all";

  await ensureActivitiesTable();

  const results: Record<string, unknown> = {};

  if (source === "myrealtrip" || source === "all") {
    results.tours = await syncMyrealtrip();
    results.accommodation = await syncAccommodation();
  }

  return NextResponse.json({
    ...results,
    timestamp: new Date().toISOString(),
  });
}
