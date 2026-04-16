import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function ensureFlightTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS flight_price_history (
      id SERIAL PRIMARY KEY,
      collected_at DATE NOT NULL,
      dep_city VARCHAR(10) NOT NULL,
      arr_city VARCHAR(10) NOT NULL,
      min_price INTEGER NOT NULL,
      period INTEGER NOT NULL,
      UNIQUE(collected_at, dep_city, arr_city, period)
    )
  `);
}

export async function ensureActivitiesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      source VARCHAR(20) NOT NULL,
      source_id VARCHAR(100) NOT NULL,
      city_slug VARCHAR(50) NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price INTEGER,
      price_display VARCHAR(50),
      image_url TEXT,
      affiliate_url TEXT NOT NULL,
      category VARCHAR(100),
      tags TEXT[],
      rating NUMERIC(3,2),
      review_count INTEGER DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(source, source_id)
    );
    CREATE INDEX IF NOT EXISTS idx_activities_city ON activities(city_slug, source);
    CREATE INDEX IF NOT EXISTS idx_activities_rating ON activities(city_slug, rating DESC NULLS LAST);
  `);
}

export async function ensureBlogPostsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(200) NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      keywords TEXT[] NOT NULL DEFAULT '{}',
      cover_image TEXT,
      cover_gradient VARCHAR(100) NOT NULL DEFAULT 'from-blue-400 to-purple-500',
      cover_emoji VARCHAR(10) NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status, date DESC);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
  `);
}

export default pool;
