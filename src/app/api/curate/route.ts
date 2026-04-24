import { NextRequest, NextResponse } from "next/server";
import { curate, type Companion, type BudgetTier, type Duration } from "@/lib/curator";

export const dynamic = "force-dynamic";

const VALID_COMP: Companion[] = ["solo", "friends"];
const VALID_BUDGET: BudgetTier[] = ["budget", "mid", "premium"];
const VALID_DURATION: Duration[] = ["short", "mid", "long"];

function asEnum<T extends string>(raw: unknown, valid: T[]): T | null {
  if (typeof raw !== "string") return null;
  return (valid as readonly string[]).includes(raw) ? (raw as T) : null;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const companion = asEnum(b.companion, VALID_COMP);
  const budget = asEnum(b.budget, VALID_BUDGET);
  const duration = asEnum(b.duration, VALID_DURATION);

  if (!companion || !budget || !duration) {
    return NextResponse.json(
      { error: "companion|budget|duration required" },
      { status: 400 }
    );
  }

  const result = await curate({ companion, budget, duration });
  return NextResponse.json(result);
}
