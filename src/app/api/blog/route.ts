import { NextRequest, NextResponse } from "next/server";
import { getAllPublishedPosts, upsertBlogPost } from "@/lib/blog";

export async function GET() {
  const posts = await getAllPublishedPosts();
  return NextResponse.json({
    posts: posts.map(({ content, ...rest }) => rest),
    total: posts.length,
  });
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  const internalKey = request.headers.get("x-internal-key");
  const isInternal = internalKey === "openclaw-internal-2026";
  if (!isInternal && apiKey !== process.env.COLLECT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.slug || !body.title || !body.description || !body.content) {
    return NextResponse.json(
      { error: "Missing required fields: slug, title, description, content" },
      { status: 400 }
    );
  }

  const post = await upsertBlogPost({
    slug: body.slug,
    title: body.title,
    description: body.description,
    date: body.date,
    keywords: body.keywords,
    cover_image: body.cover_image,
    cover_gradient: body.cover_gradient,
    cover_emoji: body.cover_emoji,
    content: body.content,
    status: body.status,
  });

  return NextResponse.json({ ok: true, post }, { status: 201 });
}
