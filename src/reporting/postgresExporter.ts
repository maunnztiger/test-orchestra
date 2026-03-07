import { Client } from "pg";
import { v4 as uuidv4 } from 'uuid';

import { 
  TestRun,
  FeatureResult,
  ScenarioResult,
  StepResult
 } from "./domian";
import { runScenariosFromPath } from "runner";

 export class PostgresExporter {
  private client: Client;

  constructor(connectionString: string) {
    this.client = new Client({connectionString});
  }

  async export(run: TestRun) {
    await this.client.connect();

    try{
      const runId = uuidv4();
      await this.insertRun(runId, run);

      for (const feature of run.features) {
        const featureId = uuidv4();
        await this.insertFeature(featureId, runId, feature)


        for( const scenario of feature.scenarios ) {
          const scenarioId = uuidv4();
          await this.insertScenario(scenarioId, featureId, scenario);

          for (const step of scenario.steps) {
            await this.insertStep(uuidv4(), scenarioId, step)
          }
        }
      }
    } finally {
      await this.client.end();
    }
    
  }

   private async insertRun(runId: string, run: TestRun) {
    await this.client.query(
      `
      INSERT INTO test_runs (id, started_at, finished_at, duration_ms)
      VALUES ($1, $2, $3, $4)
      `,
      [
        runId,
        run.startedAt,
        run.finishedAt,
        run.durationMs
      ]
    );
  }

  private async insertFeature(
    featureId: string,
    runId: string,
    feature: FeatureResult
  ) {
      await this.client.query(
      `
      INSERT INTO features (id, test_run_id, name, uri, status, duration_ms)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        featureId,
        runId,
        feature.name,
        feature.uri,
        feature.status,
        feature.durationMs
      ]
    );
  }

  private async insertScenario(
    scenarioId: string,
    featureId: string,
    scenario: ScenarioResult
  ) {
    await this.client.query(
      `
      INSERT INTO scenarios (id, feature_id, name, status, duration_ms)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        scenarioId,
        featureId,
        scenario.name,
        scenario.status,
        scenario.durationMs
      ]
    );

    for (const tag of scenario.tags) {
      await this.client.query(
        `
        INSERT INTO scenario_tags (scenario_id, tag)
        VALUES ($1, $2)
        `,
        [scenarioId, tag]
      );
    }
  }

  private async insertStep(
    stepId: string,
    scenarioId: string,
    step: StepResult
  ) {
    await this.client.query(
      `
      INSERT INTO steps (id, scenario_id, keyword, text, status, duration_ms, error)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        stepId,
        scenarioId,
        step.keyword,
        step.text,
        step.status,
        step.durationMs,
        step.error ?? null
      ]
    );
  }
 }