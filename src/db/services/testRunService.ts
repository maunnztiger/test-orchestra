// src/db/services/testRunService.ts
import { QueryBuilder } from "../postgres_querybuilder";
import { Client } from "pg";
import { TestRun } from "../../reporting/domain";
import { TestRunRepository } from "../repositories/testRunRepository";
import { FeatureRepository } from "../repositories/featureRepository";
import { ScenarioRepository } from "../repositories/scenarioRepository";
import { StepRepository } from "../repositories/stepRepository";

export class TestRunService {
  private runs: TestRunRepository;
  private features: FeatureRepository;
  private scenarios: ScenarioRepository;
  private steps: StepRepository;

  constructor(private client: Client) {
    const db = new QueryBuilder(client);

    this.runs = new TestRunRepository(db);
    this.features = new FeatureRepository(db);
    this.scenarios = new ScenarioRepository(db);
    this.steps = new StepRepository(client, db);
  }

  async save(run: TestRun) {
    await this.client.query("BEGIN");

    try {
      const runId = await this.runs.createRun(run);

      for (const feature of run.features) {
        const featureId = await this.features.createFeature(runId, feature);

        for (const scenario of feature.scenarios) {
          const scenarioId = await this.scenarios.createScenario(featureId, scenario);

          await this.steps.insertBulk(scenarioId, scenario.steps);
        }
      }

      await this.client.query("COMMIT");
    } catch (err) {
      await this.client.query("ROLLBACK");
      throw err;
    }
  }
}
