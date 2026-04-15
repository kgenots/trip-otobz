import { NextRequest, NextResponse } from "next/server";
import { ensureActivitiesTable } from "@/lib/db";
import { syncMyrealtrip } from "@/lib/sync-myrealtrip";

export const maxDuration = 300; // 5분

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key || key !== process.env.COLLECT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const source = req.nextUrl.searchParams.get("source") || "myrealtrip";

  await ensureActivitiesTable();

  if (source === "myrealtrip" || source === "all") {
    const result = await syncMyrealtrip();
    return NextResponse.json({
      source: "myrealtrip",
      ...result,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({ error: `Unknown source: ${source}` }, { status: 400 });
}
