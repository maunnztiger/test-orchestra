import { Client } from "pg";
import { QueryBuilder } from "db/postgres_querybuilder";
import { ReportExporter } from "./exporter";
import { v4 as uuidv4 } from "uuid";

import { TestRun, FeatureResult, ScenarioResult, StepResult } from "./domian";

export class PostgresExporter implements ReportExporter {
  private client: Client;

  constructor(connectionString: string) {
    this.client = new Client({ connectionString });
  }
  async export(run: TestRun) {
    await this.client.connect();

    try {
      const runId = uuidv4();
      await this.insertRun(runId, run);

      for (const feature of run.features) {
        const featureId = uuidv4();
        await this.insertFeature(featureId, runId, feature);

        for (const scenario of feature.scenarios) {
          const scenarioId = uuidv4();
          await this.insertScenario(scenarioId, featureId, scenario);

          for (const step of scenario.steps) {
            await this.insertStep(uuidv4(), scenarioId, step);
          }
        }
      }
      console.log("📄 Report written to `testorchestra_results`-database");

    } finally {
      await this.client.end();
    }
  }

  private async insertRun(runId: string, run: TestRun) {
    const db = new QueryBuilder(this.client);
    try {
      await this.client.query("BEGIN");
      await db.insert("test_runs")
        .values({
          id: runId,
          started_at: run.startedAt,
          finished_at: run.finishedAt,
          duration_ms: run.durationMs
        })
        .execute();
      await this.client.query("COMMIT");
    } catch (err) {
      await this.client.query("ROLLBACK");
      throw err;
    }
  }

  private async insertFeature(featureId: string, runId: string, feature: FeatureResult) {
    const db = new QueryBuilder(this.client);
    try {
      await this.client.query("BEGIN");
      await db.insert("features")
        .values({
          id: featureId,
          test_run_id: runId,
          name: feature.name,
          uri: feature.uri,
          status: feature.status,
          duration_ms: feature.durationMs
        })
        .execute();
      await this.client.query("COMMIT");
    } catch (err) {
      await this.client.query("ROLLBACK");
      throw err;
    }
  }

  private async insertScenario(scenarioId: string, featureId: string, scenario: ScenarioResult) {
    const db = new QueryBuilder(this.client);
    try {
      await this.client.query("BEGIN");
      await db.insert("scenarios")
        .values({
          id: scenarioId,
          feature_id: featureId,
          name: scenario.name,
          status: scenario.status,
          duration_ms: scenario.durationMs
        })
        .execute();

      for (const tag of scenario.tags) {
        db.insert("scenario_tags")
          .values({
            scenario_id: scenarioId,
            tag: tag
          })
          .execute();
      }
      await this.client.query("COMMIT");
    } catch (err) {
      await this.client.query("ROLLBACK");
      throw err;
    }
  }

  private async insertStep(stepId: string, scenarioId: string, step: StepResult) {
    const db = new QueryBuilder(this.client);
    try {
      await this.client.query("BEGIN");
      await db.insert("steps")
        .values({
          id: stepId,
          scenario_id: scenarioId,
          keyword: step.keyword,
          text: step.text,
          status: step.status,
          duration_ms: step.durationMs,
          error: step.error ?? null
        })
        .execute();
      await this.client.query("COMMIT");
    } catch (err) {
      await this.client.query("ROLLBACK");
      throw err;
    }

  }
}
