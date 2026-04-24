import { NextResponse } from "next/server";
import { computeHeroSummary } from "@/lib/hero-summary";

export const dynamic = "force-dynamic";
export const revalidate = 900;

export async function GET() {
  const data = await computeHeroSummary();
  return NextResponse.json(data);
}
