import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const UPLOAD_DIR = process.env.BLOG_UPLOAD_DIR || "/app/uploads";
const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL || "https://trip.otobz.com";
const DASHBOARD_BASE_URL =
  process.env.DASHBOARD_BASE_URL || "http://obot-dashboard.worker.svc.cluster.local:3000";
const DASHBOARD_INTERNAL_KEY =
  process.env.INTERNAL_API_KEY || process.env.DASHBOARD_INTERNAL_KEY || "";

function slugSafe(value: string): string {
  return value.replace(/[^a-z0-9-]/gi, "").slice(0, 60);
}

async function callDashboardImgen(opts: {
  query: string;
  instruction?: string;
  source?: "naver" | "unsplash";
}): Promise<{
  base64: string;
  mime: string;
  origin_url: string;
  origin_id: string;
  search_source: string;
  fallback_reason?: string;
}> {
  const res = await fetch(`${DASHBOARD_BASE_URL}/api/imgen/naver-gemini`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-key": DASHBOARD_INTERNAL_KEY,
    },
    body: JSON.stringify(opts),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`dashboard imgen failed (${res.status}): ${detail}`);
  }
  return await res.json();
}

async function saveImage(
  slug: string,
  base64: string,
  mime: string,
  source: string
) {
  const ext = mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";
  const filename = `${slugSafe(slug)}-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(filePath, Buffer.from(base64, "base64"));
  return {
    url: `${PUBLIC_BASE_URL}/api/blog/images/${filename}`,
    filename,
    mime,
    source,
  };
}

export async function POST(request: NextRequest) {
  const internalKey = request.headers.get("x-internal-key");
  const expected = DASHBOARD_INTERNAL_KEY;
  if (!expected || internalKey !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    slug?: string;
    query?: string;
    instruction?: string;
    source?: "naver" | "unsplash";
  };
  const { slug, query, instruction, source } = body;

  if (!slug || !query) {
    return NextResponse.json(
      { error: "Missing required fields: slug, query" },
      { status: 400 }
    );
  }

  let imgen;
  try {
    imgen = await callDashboardImgen({ query, instruction, source });
  } catch (e) {
    return NextResponse.json(
      { error: "dashboard imgen call failed", detail: String(e) },
      { status: 502 }
    );
  }

  const saved = await saveImage(slug, imgen.base64, imgen.mime, "gemini-edit");
  return NextResponse.json({
    ok: true,
    ...saved,
    search_source: imgen.search_source,
    origin_id: imgen.origin_id,
    origin_url: imgen.origin_url,
    fallback_reason: imgen.fallback_reason,
  });
}
