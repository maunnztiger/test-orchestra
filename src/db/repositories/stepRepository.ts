// src/db/repositories/stepRepository.ts
import { QueryBuilder } from "../postgres_querybuilder";
import { StepResult } from "../../reporting/domain";
import { Client } from "pg";

export class StepRepository {
  constructor(
    private client: Client,
    private db: QueryBuilder
  ) {}

  async insertBulk(scenarioId: number, steps: StepResult[]) {
    if (steps.length === 0) return;

    const columns = ["scenario_id", "keyword", "text", "status", "duration_ms", "error"];

    const values: unknown[] = [];
    const placeholders: string[] = [];

    let i = 1;

    for (const step of steps) {
      const row = [
        scenarioId,
        step.keyword,
        step.text,
        step.status,
        step.durationMs,
        step.error ?? null
      ];

      const rowPlaceholders = row.map(() => `$${i++}`);
      values.push(...row);

      placeholders.push(`(${rowPlaceholders.join(", ")})`);
    }

    const sql = `
      INSERT INTO steps (${columns.join(", ")})
      VALUES ${placeholders.join(", ")}
    `;

    await this.client.query(sql, values);
  }
}
