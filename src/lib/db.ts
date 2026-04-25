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
      slug VARCHAR(200) NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      keywords TEXT[] NOT NULL DEFAULT '{}',
      cover_image TEXT,
      cover_gradient VARCHAR(100) NOT NULL DEFAULT 'from-blue-400 to-purple-500',
      cover_emoji VARCHAR(10) NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'published',
      lang VARCHAR(8) NOT NULL DEFAULT 'ko',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (slug, lang)
    );
    CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status, date DESC);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_lang ON blog_posts(lang, status, date DESC);
  `);
}

// Price Pulse tables
export async function ensurePricePulseTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS price_routes (
      id SERIAL PRIMARY KEY,
      dep_city VARCHAR(50) NOT NULL DEFAULT 'Seoul',
      arr_city VARCHAR(50) NOT NULL,
      arr_code VARCHAR(10) NOT NULL UNIQUE,
      display_name VARCHAR(100) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_price_routes_active ON price_routes(arr_code, is_active) WHERE is_active = true;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS price_history (
      id SERIAL PRIMARY KEY,
      route_code VARCHAR(10) NOT NULL,
      price INTEGER NOT NULL,
      period INTEGER NOT NULL,
      collected_at DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(route_code, period, collected_at)
    );
    CREATE INDEX IF NOT EXISTS idx_price_history_route ON price_history(route_code, collected_at DESC);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS price_alerts (
      id SERIAL PRIMARY KEY,
      route_code VARCHAR(10) NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      user_name VARCHAR(100),
      target_price INTEGER NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      triggered_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(route_code, is_active);
    CREATE INDEX IF NOT EXISTS idx_price_alerts_triggered ON price_alerts(route_code, triggered_at) WHERE triggered_at IS NULL;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      route_code VARCHAR(10),
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(endpoint)
    );
  `);

  // Seed popular routes (Seoul departures)
  await pool.query(`
    INSERT INTO price_routes (arr_city, arr_code, display_name, sort_order) VALUES
      ('Bangkok', 'BKK', 'Bangkok', 1),
      ('Tokyo', 'NRT', 'Tokyo', 2),
      ('Chiang Mai', 'CNX', 'Chiang Mai', 3),
      ('Ho Chi Minh', 'SGN', 'Ho Chi Minh City', 4),
      ('Kuala Lumpur', 'KUL', 'Kuala Lumpur', 5),
      ('Yangon', 'RGN', 'Yangon', 6),
      ('Manila', 'MNL', 'Manila', 7),
      ('Taipei', 'TPE', 'Taipei', 8),
      ('Singapore', 'SIN', 'Singapore', 9),
      ('Beijing', 'PEK', 'Beijing', 10)
    ON CONFLICT (arr_code) DO UPDATE
      SET arr_city = EXCLUDED.arr_city, display_name = EXCLUDED.display_name;
  `);
}

export default pool;
