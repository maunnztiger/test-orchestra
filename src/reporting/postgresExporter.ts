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

      const { id: runId } = await this.insertRun(run);

      for (const feature of run.features) {
        const { id: featureId } = await this.insertFeature(runId, feature);

        for (const scenario of feature.scenarios) {
          const { id: scenarioId } = await this.insertScenario(featureId, scenario);

          for (const step of scenario.steps) {
            await this.insertStep(scenarioId, step);
          }
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

  private async insertRun(run: TestRun) {
    return this.db
      .insert("test_runs")
      .values({
        started_at: run.startedAt,
        finished_at: run.finishedAt,
        duration_ms: run.durationMs
      })
      .execute<{ id: number }>("id");
  }

  private async insertFeature(runId: number, feature: FeatureResult) {
    return this.db
      .insert("features")
      .values({
        test_run_id: runId,
        name: feature.name,
        uri: feature.uri,
        status: feature.status,
        duration_ms: feature.durationMs
      })
      .execute<{ id: number }>("id");
  }

  private async insertScenario(featureId: number, scenario: ScenarioResult) {
    const { id: scenarioId } = await this.db
      .insert("scenarios")
      .values({
        feature_id: featureId,
        name: scenario.name,
        status: scenario.status,
        duration_ms: scenario.durationMs
      })
      .execute<{ id: number }>("id");

    for (const tag of scenario.tags) {
      await this.db.insert("scenario_tags").values({ scenario_id: scenarioId, tag }).execute();
    }

    return { id: scenarioId };
  }

  private async insertStep(scenarioId: number, step: StepResult) {
    return this.db
      .insert("steps")
      .values({
        scenario_id: scenarioId,
        keyword: step.keyword,
        text: step.text,
        status: step.status,
        duration_ms: step.durationMs,
        error: step.error ?? null
      })
      .execute();
  }
}
