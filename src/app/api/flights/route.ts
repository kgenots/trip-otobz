import { NextRequest, NextResponse } from "next/server";
import { getFlightBulkLowest, getFlightCalendar, getFlightWindow } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    let data;
    switch (action) {
      case "bulk-lowest":
        data = await getFlightBulkLowest(params.depCityCd, params.period);
        break;
      case "calendar":
        data = await getFlightCalendar(
          params.depCityCd, params.arrCityCd, params.period,
          params.startDate, params.endDate
        );
        break;
      case "window":
        data = await getFlightWindow(params.depCityCd, params.arrCityCd, params.period);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
