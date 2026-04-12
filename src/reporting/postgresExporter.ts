import { Client } from "pg";
import { QueryBuilder } from "db/postgres_querybuilder";
import { ReportExporter } from "./exporter";
import { TestRun, FeatureResult, ScenarioResult, StepResult } from "./domain";

export class PostgresExporter implements ReportExporter {
  private readonly client: Client;
  private readonly db: QueryBuilder;

  constructor(connectionString: string) {
    this.client = new Client({ connectionString });
    this.db = new QueryBuilder(this.client);
  }

  async export(run: TestRun) {
    await this.client.connect();

    try {
      await this.client.query("BEGIN");

      const runId = await this.insertRun(run);

      for (const feature of run.features) {
        const featureId = await this.insertFeature(runId, feature);

        for (const scenario of feature.scenarios) {
          const scenarioId = await this.insertScenario(featureId, scenario);

          // 🔥 Batch Steps
          await this.insertStepsBulk(scenarioId, scenario.steps);
        }
      }

      await this.client.query("COMMIT");
      console.log("📄 Report written to `testorchestra_results`-database");
    } catch (err) {
      await this.client.query("ROLLBACK");
      throw err;
    } finally {
      await this.client.end();
    }
  }

  // ========================
  // INSERTS
  // ========================

  private async insertRun(run: TestRun): Promise<number> {
    const result = await this.db
      .insert<{
        started_at: Date;
        finished_at: Date | null;
        duration_ms: number;
      }>("test_runs")
      .values({
        started_at: run.startedAt,
        finished_at: run.finishedAt ?? null,
        duration_ms: run.durationMs ?? 0
      })
      .execute<{ id: number }>("id");

    return result.id;
  }

  private async insertFeature(runId: number, feature: FeatureResult): Promise<number> {
    const result = await this.db
      .insert<{
        test_run_id: number;
        name: string;
        uri: string;
        status: string;
        duration_ms: number;
      }>("features")
      .values({
        test_run_id: runId,
        name: feature.name,
        uri: feature.uri,
        status: feature.status,
        duration_ms: feature.durationMs ?? 0
      })
      .execute<{ id: number }>("id");

    return result.id;
  }

  private async insertScenario(featureId: number, scenario: ScenarioResult): Promise<number> {
    const result = await this.db
      .insert<{
        feature_id: number;
        name: string;
        status: string;
        duration_ms: number;
      }>("scenarios")
      .values({
        feature_id: featureId,
        name: scenario.name,
        status: scenario.status,
        duration_ms: scenario.durationMs ?? 0
      })
      .execute<{ id: number }>("id");

    const scenarioId = result.id;

    // 🔥 Tags batch
    if (scenario.tags.length > 0) {
      for (const tag of scenario.tags) {
        await this.db
          .insert<{ scenario_id: number; tag: string }>("scenario_tags")
          .values({ scenario_id: scenarioId, tag })
          .execute();
      }
    }

    return scenarioId;
  }

  /**
   * 🔥 BULK INSERT für Steps (Performance!)
   */
  private async insertStepsBulk(scenarioId: number, steps: StepResult[]) {
    if (steps.length === 0) return;

    const columns = ["scenario_id", "keyword", "text", "status", "duration_ms", "error"];

    const values: unknown[] = [];
    const placeholders: string[] = [];

    let paramIndex = 1;

    for (const step of steps) {
      const rowPlaceholders: string[] = [];

      const row = [
        scenarioId,
        step.keyword,
        step.text,
        step.status,
        step.durationMs,
        step.error ?? null
      ];

      for (const value of row) {
        values.push(value);
        rowPlaceholders.push(`$${paramIndex++}`);
      }

      placeholders.push(`(${rowPlaceholders.join(", ")})`);
    }

    const sql = `
      INSERT INTO steps (${columns.join(", ")})
      VALUES ${placeholders.join(", ")}
    `;

    await this.client.query(sql, values);
  }
}
