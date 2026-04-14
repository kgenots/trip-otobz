import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    mylinkId: process.env.MYLINK_ID || "",
  });
}
