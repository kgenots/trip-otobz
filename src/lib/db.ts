import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function ensureTable() {
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

export default pool;
