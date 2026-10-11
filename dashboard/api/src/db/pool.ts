import { Pool } from "pg";

const connectionString = process.env.DB_URL;

if (!connectionString) {
  throw new Error("DB_URL is missing");
}

export const pool = new Pool({
  connectionString,
  max: 5,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});
