
import { Router } from "express";
import { pool } from "../db/pool";

export const runsRouter = Router();

runsRouter.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        tr.id,
        tr.started_at,
        tr.finished_at,
        tr.duration_ms,
        f.name AS feature,
        s.name AS scenario,
        s.status,
        COUNT(st.id)::integer AS step_count
      FROM test_runs tr
      JOIN features f
        ON f.test_run_id = tr.id
      JOIN scenarios s
        ON s.feature_id = f.id
      LEFT JOIN steps st
        ON st.scenario_id = s.id
      GROUP BY
        tr.id,
        tr.started_at,
        tr.finished_at,
        tr.duration_ms,
        f.id,
        s.id
      ORDER BY tr.started_at DESC
      LIMIT 50
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to load test runs:", error);

    res.status(500).json({
      error: "Failed to load test runs"
    });
  }
});
