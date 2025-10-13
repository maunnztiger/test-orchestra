import express from "express";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
app.use(express.json());

// Datenbankverbindung
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT) || 5432,
});

// einfache Testroute
app.get("/api/health", async (_, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));
