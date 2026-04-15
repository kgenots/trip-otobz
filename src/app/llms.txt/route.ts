import { cities } from "@/data/cities";
import { blogPosts } from "@/data/blog-posts";

export function GET() {
  const base = "https://trip.otobz.com";

  const lines = [
    "# Trip OTOBZ",
    "",
    "> 여행지에서 뭐하지? 전 세계 인기 도시의 베스트 투어·액티비티를 찾아보세요.",
    "",
    `- Homepage: ${base}`,
    `- Blog: ${base}/blog`,
    `- Sitemap: ${base}/sitemap.xml`,
    "",
    "## 도시별 액티비티 가이드",
    "",
    ...cities.map(
      (c) => `- [${c.emoji} ${c.cityKo} (${c.cityEn}) — ${c.countryKo}](${base}/city/${c.slug}): ${c.description || `${c.cityKo} 베스트 액티비티·투어`}`
    ),
    "",
    "## 여행 블로그",
    "",
    ...blogPosts.map(
      (p) => `- [${p.title}](${base}/blog/${p.slug}): ${p.description}`
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
