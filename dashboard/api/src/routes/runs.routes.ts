import { Router } from "express";
import { QueryBuilder } from "@testorchestra/database";
import { pool } from "../db/pool";

export const runsRouter = Router();

runsRouter.get("/", async (_req, res) => {
  try {
    const qb = new QueryBuilder(pool);
    const result = await qb
      .select([
        "tr.id",
        "tr.started_at",
        "tr.finished_at",
        "tr.duration_ms",
        "f.name AS feature",
        "s.name AS scenario",
        "s.status",
        "COUNT(st.id)::integer AS step_count"
      ])
      .from("test_runs tr")
      .join("features f", "f.test_run_id = tr.id")
      .join("scenarios s", "s.feature_id = f.id")
      .leftJoin("steps st", "st.scenario_id = s.id")
      .groupBy(["tr.id", "tr.started_at", "tr.finished_at", "tr.duration_ms", "f.id", "s.id"])
      .orderBy("tr.started_at", "DESC")
      .limit(50)
      .execute();

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to load test runs:", error);

    res.status(500).json({
      error: "Failed to load test runs"
    });
  }
});
