import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const GEMINI_MODEL = "gemini-2.5-flash-image";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const UNSPLASH_SEARCH = "https://api.unsplash.com/search/photos";
const UPLOAD_DIR = process.env.BLOG_UPLOAD_DIR || "/app/uploads";
const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL || "https://trip.otobz.com";

const DEFAULT_EDIT_INSTRUCTION =
  "Reimagine this scene from a slightly different camera angle (rotate viewpoint about 20-30 degrees, slightly lower or side). Keep the same subject, location, time of day, mood. Warm natural lighting, cinematic travel photography. No text, no watermarks, no logos.";

function slugSafe(value: string): string {
  return value.replace(/[^a-z0-9-]/gi, "").slice(0, 60);
}

async function searchUnsplash(query: string, accessKey: string) {
  const url = `${UNSPLASH_SEARCH}?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Unsplash search failed (${res.status}): ${detail}`);
  }
  const data = (await res.json()) as {
    results?: { id: string; urls: { regular: string; full: string } }[];
  };
  const results = data.results || [];
  if (results.length === 0) return null;
  const pick = results[Math.floor(Math.random() * Math.min(5, results.length))];
  return { id: pick.id, imageUrl: pick.urls.regular };
}

async function downloadAsBase64(
  url: string
): Promise<{ base64: string; mime: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  const mime = res.headers.get("content-type") || "image/jpeg";
  const buf = Buffer.from(await res.arrayBuffer());
  return { base64: buf.toString("base64"), mime };
}

async function editWithGemini(
  apiKey: string,
  base64: string,
  mime: string,
  instruction: string
) {
  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: instruction },
            { inlineData: { mimeType: mime, data: base64 } },
          ],
        },
      ],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini edit failed (${res.status}): ${detail}`);
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(
    (p: { inlineData?: { data?: string; mimeType?: string } }) =>
      p.inlineData?.data
  );
  if (!imagePart?.inlineData?.data) {
    throw new Error("Gemini returned no image");
  }
  return {
    base64: imagePart.inlineData.data as string,
    mime: (imagePart.inlineData.mimeType as string) || "image/png",
  };
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
  if (internalKey !== "openclaw-internal-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!geminiKey || !unsplashKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY or UNSPLASH_ACCESS_KEY" },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    slug?: string;
    query?: string;
    instruction?: string;
  };
  const { slug, query } = body;
  const instruction = body.instruction || DEFAULT_EDIT_INSTRUCTION;

  if (!slug || !query) {
    return NextResponse.json(
      { error: "Missing required fields: slug, query" },
      { status: 400 }
    );
  }

  let found;
  try {
    found = await searchUnsplash(query, unsplashKey);
  } catch (e) {
    return NextResponse.json(
      { error: "Unsplash search error", detail: String(e) },
      { status: 502 }
    );
  }
  if (!found) {
    return NextResponse.json(
      { error: "No Unsplash results for query", query },
      { status: 404 }
    );
  }

  let origBase64: string;
  let origMime: string;
  try {
    const dl = await downloadAsBase64(found.imageUrl);
    origBase64 = dl.base64;
    origMime = dl.mime;
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to download Unsplash image", detail: String(e) },
      { status: 502 }
    );
  }

  try {
    const edited = await editWithGemini(geminiKey, origBase64, origMime, instruction);
    const saved = await saveImage(slug, edited.base64, edited.mime, "gemini-edit");
    return NextResponse.json({
      ok: true,
      ...saved,
      unsplash_id: found.id,
      origin_url: found.imageUrl,
    });
  } catch (e) {
    const saved = await saveImage(slug, origBase64, origMime, "unsplash-fallback");
    return NextResponse.json({
      ok: true,
      ...saved,
      unsplash_id: found.id,
      origin_url: found.imageUrl,
      fallback_reason: String(e),
    });
  }
}
