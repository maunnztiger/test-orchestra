// src/db/repositories/scenarioRepository.ts
import { Repository } from "../repository";
import { ScenarioResult } from "../../reporting/domain";
import { ScenarioRow } from "db/types";

export class ScenarioRepository extends Repository<ScenarioRow> {
  protected table = "scenarios";

  async createScenario(featureId: number, scenario: ScenarioResult): Promise<number> {
    const result = await this.createReturning<{ id: number }>(
      {
        feature_id: featureId,
        name: scenario.name,
        status: scenario.status,
        duration_ms: scenario.durationMs ?? 0
      },
      "id"
    );

    const scenarioId = result.id;

    // 🔥 Tags direkt hier kapseln
    for (const tag of scenario.tags) {
      await this.db.insert("scenario_tags").values({ scenario_id: scenarioId, tag }).execute();
    }

    return scenarioId;
  }
}
