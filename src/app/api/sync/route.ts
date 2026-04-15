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

  const source = req.nextUrl.searchParams.get("source") || "tours";

  await ensureActivitiesTable();

  if (source === "tours") {
    const result = await syncMyrealtrip();
    return NextResponse.json({ source: "tours", ...result, timestamp: new Date().toISOString() });
  }

  if (source === "accommodation") {
    const result = await syncAccommodation();
    return NextResponse.json({ source: "accommodation", ...result, timestamp: new Date().toISOString() });
  }

  return NextResponse.json({ error: `Unknown source: ${source}. Use 'tours' or 'accommodation'` }, { status: 400 });
}
