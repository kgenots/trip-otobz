import { blogPosts as staticPosts, type BlogPost } from "./blog-posts";
import { getAllPublishedPosts, getPostBySlug, getAllSlugs } from "@/lib/blog";

// Merge static posts with DB posts. DB posts take precedence for same slug.
export async function getMergedBlogPosts(): Promise<BlogPost[]> {
  let dbPosts: BlogPost[] = [];
  try {
    const rows = await getAllPublishedPosts();
    dbPosts = rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      description: r.description,
      date: typeof r.date === "string" ? r.date : new Date(r.date).toISOString().split("T")[0],
      keywords: r.keywords || [],
      coverImage: r.cover_image || undefined,
      coverGradient: r.cover_gradient || "from-blue-400 to-purple-500",
      coverEmoji: r.cover_emoji || "",
      content: r.content,
    }));
  } catch (e) {
    console.error("[blog] DB query failed, using static only:", e);
  }

  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const staticOnly = staticPosts.filter((p) => !dbSlugs.has(p.slug));
  return [...dbPosts, ...staticOnly].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getMergedPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  try {
    const row = await getPostBySlug(slug);
    if (row) {
      return {
        slug: row.slug,
        title: row.title,
        description: row.description,
        date: typeof row.date === "string" ? row.date : new Date(row.date).toISOString().split("T")[0],
        keywords: row.keywords,
        coverImage: row.cover_image || undefined,
        coverGradient: row.cover_gradient,
        coverEmoji: row.cover_emoji,
        content: row.content,
      };
    }
  } catch {
    // fall through to static
  }
  return staticPosts.find((p) => p.slug === slug);
}

export async function getMergedSlugs(): Promise<string[]> {
  const staticSlugs = staticPosts.map((p) => p.slug);
  try {
    const dbSlugs = await getAllSlugs();
    return [...new Set([...dbSlugs, ...staticSlugs])];
  } catch {
    return staticSlugs;
  }
}

export type { BlogPost } from "./blog-posts";
