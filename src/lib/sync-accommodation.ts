import pool from "./db";
import { cities } from "@/data/cities";
import { searchAccommodation } from "./api";
import { buildMrtAffiliateUrl } from "./affiliate";

const DELAY_MS = 1500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function syncAccommodation(): Promise<{
  totalCities: number;
  totalItems: number;
  errors: string[];
}> {
  let totalItems = 0;
  const errors: string[] = [];

  // 7일 후 체크인, 2박 기준
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 7);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 2);
  const checkInStr = checkIn.toISOString().split("T")[0];
  const checkOutStr = checkOut.toISOString().split("T")[0];

  for (const city of cities) {
    try {
      const result = await searchAccommodation({
        keyword: city.cityKo,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        adultCount: 2,
        order: "review_desc",
        size: 50,
      });

      for (const item of result.items) {
        const affiliateUrl = buildMrtAffiliateUrl(
          `https://www.myrealtrip.com/accommodations/${item.itemId}`
        );

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
            price = EXCLUDED.price,
            price_display = EXCLUDED.price_display,
            affiliate_url = EXCLUDED.affiliate_url,
            rating = EXCLUDED.rating,
            review_count = EXCLUDED.review_count,
            updated_at = NOW()`,
          [
            `accom-${item.itemId}`,
            city.slug,
            item.itemName,
            `${"★".repeat(Math.min(item.starRating, 5))} ${item.starRating}성급`,
            item.salePrice || null,
            item.salePrice ? `${item.salePrice.toLocaleString("ko-KR")}원` : null,
            null,
            affiliateUrl,
            "숙소",
            [],
            item.reviewScore ? parseFloat(item.reviewScore) : null,
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

  // 7일 이상 미갱신 숙소 정리
  await pool.query(
    `DELETE FROM activities WHERE source = 'myrealtrip' AND category = '숙소' AND updated_at < NOW() - INTERVAL '7 days'`
  );

  return { totalCities: cities.length, totalItems, errors };
}
