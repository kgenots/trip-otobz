import pool, { ensureBlogPostsTable } from "./db";

export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
  cover_image: string | null;
  cover_gradient: string;
  cover_emoji: string;
  content: string;
  status: string;
  lang: string;
  created_at: string;
  updated_at: string;
}

export async function getAllPublishedPosts(
  lang: string = "ko",
): Promise<BlogPostRow[]> {
  await ensureBlogPostsTable();
  const { rows } = await pool.query<BlogPostRow>(
    `SELECT * FROM blog_posts WHERE status = 'published' AND lang = $1 ORDER BY date DESC`,
    [lang],
  );
  return rows;
}

export async function getPostBySlug(
  slug: string,
  lang: string = "ko",
): Promise<BlogPostRow | null> {
  await ensureBlogPostsTable();
  const { rows } = await pool.query<BlogPostRow>(
    `SELECT * FROM blog_posts WHERE slug = $1 AND lang = $2 AND status = 'published' LIMIT 1`,
    [slug, lang],
  );
  return rows[0] || null;
}

export async function getAllSlugs(lang: string = "ko"): Promise<string[]> {
  await ensureBlogPostsTable();
  const { rows } = await pool.query<{ slug: string }>(
    `SELECT slug FROM blog_posts WHERE status = 'published' AND lang = $1 ORDER BY date DESC`,
    [lang],
  );
  return rows.map((r) => r.slug);
}

export async function upsertBlogPost(post: {
  slug: string;
  title: string;
  description: string;
  date?: string;
  keywords?: string[];
  cover_image?: string;
  cover_gradient?: string;
  cover_emoji?: string;
  content: string;
  status?: string;
  lang?: string;
}): Promise<BlogPostRow> {
  await ensureBlogPostsTable();
  const { rows } = await pool.query<BlogPostRow>(
    `INSERT INTO blog_posts (slug, title, description, date, keywords, cover_image, cover_gradient, cover_emoji, content, status, lang)
     VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), COALESCE($5::text[], '{}'), $6, COALESCE($7, 'from-blue-400 to-purple-500'), COALESCE($8, ''), $9, COALESCE($10, 'published'), COALESCE($11, 'ko'))
     ON CONFLICT (slug, lang) DO UPDATE SET
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       keywords = EXCLUDED.keywords,
       cover_image = EXCLUDED.cover_image,
       cover_gradient = EXCLUDED.cover_gradient,
       cover_emoji = EXCLUDED.cover_emoji,
       content = EXCLUDED.content,
       status = EXCLUDED.status,
       updated_at = NOW()
     RETURNING *`,
    [
      post.slug,
      post.title,
      post.description,
      post.date || null,
      post.keywords || [],
      post.cover_image || null,
      post.cover_gradient || null,
      post.cover_emoji || null,
      post.content,
      post.status || "published",
      post.lang || "ko",
    ],
  );
  return rows[0];
}
