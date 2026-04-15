import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");
  if (!city) {
    return NextResponse.json({ error: "city parameter required" }, { status: 400 });
  }

  const source = req.nextUrl.searchParams.get("source") || "all";
  const sort = req.nextUrl.searchParams.get("sort") || "rating";
  const category = req.nextUrl.searchParams.get("category") || null;
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") || "1"));
  const perPage = Math.min(100, Math.max(1, parseInt(req.nextUrl.searchParams.get("perPage") || "30")));
  const offset = (page - 1) * perPage;

  let orderBy: string;
  switch (sort) {
    case "price_asc":
      orderBy = "price ASC NULLS LAST";
      break;
    case "price_desc":
      orderBy = "price DESC NULLS LAST";
      break;
    default:
      orderBy = "rating DESC NULLS LAST, review_count DESC";
  }

  const conditions: string[] = ["city_slug = $1"];
  const params: (string | number | null)[] = [city];
  let idx = 2;

  if (source !== "all") {
    conditions.push(`source = $${idx}`);
    params.push(source);
    idx++;
  }

  if (category) {
    conditions.push(`category = $${idx}`);
    params.push(category);
    idx++;
  }

  const where = conditions.join(" AND ");

  try {
    const [itemsResult, countResult, sourcesResult, categoriesResult] = await Promise.all([
      pool.query(
        `SELECT id, source, source_id, city_slug, title, description,
                price, price_display, image_url, affiliate_url,
                category, tags, rating, review_count
         FROM activities
         WHERE ${where}
         ORDER BY ${orderBy}
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, perPage, offset]
      ),
      pool.query(
        `SELECT COUNT(*) as total FROM activities WHERE ${where}`,
        params
      ),
      pool.query(
        `SELECT source, COUNT(*) as count FROM activities WHERE city_slug = $1 GROUP BY source`,
        [city]
      ),
      pool.query(
        `SELECT category, COUNT(*) as count FROM activities
         WHERE city_slug = $1 AND category IS NOT NULL
         GROUP BY category ORDER BY count DESC`,
        [city]
      ),
    ]);

    const sources: Record<string, number> = {};
    for (const row of sourcesResult.rows) {
      sources[row.source] = parseInt(row.count);
    }

    const categories = categoriesResult.rows.map((r) => ({
      name: r.category,
      count: parseInt(r.count),
    }));

    return NextResponse.json({
      data: {
        items: itemsResult.rows.map((r) => ({
          id: r.id,
          source: r.source,
          sourceId: r.source_id,
          citySlug: r.city_slug,
          title: r.title,
          description: r.description,
          price: r.price,
          priceDisplay: r.price_display,
          imageUrl: r.image_url,
          affiliateUrl: r.affiliate_url,
          category: r.category,
          tags: r.tags || [],
          rating: r.rating ? parseFloat(r.rating) : null,
          reviewCount: r.review_count,
        })),
        totalCount: parseInt(countResult.rows[0].total),
        page,
        perPage,
        sources,
        categories,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
