import pool from "./db";
import { cities } from "@/data/cities";
import { searchTna } from "./api";
import { buildMrtAffiliateUrl } from "./affiliate";

const DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function syncMyrealtrip(): Promise<{
  totalCities: number;
  totalItems: number;
  errors: string[];
}> {
  let totalItems = 0;
  const errors: string[] = [];

  for (const city of cities) {
    try {
      const result = await searchTna({
        keyword: city.cityKo,
        city: city.cityKo,
        sort: "review_score_desc",
        perPage: 100,
      });

      for (const item of result.items) {
        await pool.query(
          `INSERT INTO activities (
            source, source_id, city_slug, title, description,
            price, price_display, image_url, affiliate_url,
            category, tags, rating, review_count, updated_at
          ) VALUES (
            'myrealtrip', $1, $2, $3, $4,
            $5, $6, $7, $8,
            $9, $10, $11, $12, NOW()
          )
          ON CONFLICT (source, source_id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            price_display = EXCLUDED.price_display,
            image_url = EXCLUDED.image_url,
            affiliate_url = EXCLUDED.affiliate_url,
            category = EXCLUDED.category,
            tags = EXCLUDED.tags,
            rating = EXCLUDED.rating,
            review_count = EXCLUDED.review_count,
            updated_at = NOW()`,
          [
            item.gid,
            city.slug,
            item.itemName,
            item.description || null,
            item.salePrice || null,
            item.priceDisplay || null,
            item.imageUrl || null,
            buildMrtAffiliateUrl(item.productUrl),
            item.category || null,
            item.tags || [],
            item.reviewScore || null,
            item.reviewCount || 0,
          ]
        );
      }

      totalItems += result.items.length;
    } catch (e) {
      const msg = `${city.slug}: ${e instanceof Error ? e.message : String(e)}`;
      errors.push(msg);
    }

    await sleep(DELAY_MS);
  }

  // 7일 이상 미갱신 레코드 정리
  await pool.query(
    `DELETE FROM activities WHERE source = 'myrealtrip' AND updated_at < NOW() - INTERVAL '7 days'`
  );

  return { totalCities: cities.length, totalItems, errors };
}
