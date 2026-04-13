import { NextRequest, NextResponse } from "next/server";
import { getTnaCategories, searchTna } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    let data;
    switch (action) {
      case "categories":
        data = await getTnaCategories(params.city);
        break;
      case "search":
        data = await searchTna(params);
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
