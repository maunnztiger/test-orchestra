// src/db/repositories/featureRepository.ts
import { Repository } from "../repository";
import { FeatureResult } from "../../reporting/domain";
import { FeatureRow } from "db/types";
export class FeatureRepository extends Repository<FeatureRow> {
  protected table = "features";

  async createFeature(runId: number, feature: FeatureResult): Promise<number> {
    const result = await this.createReturning<{ id: number }>(
      {
        test_run_id: runId,
        name: feature.name,
        uri: feature.uri,
        status: feature.status,
        duration_ms: feature.durationMs ?? 0
      },
      "id"
    );

    return result.id;
  }
}