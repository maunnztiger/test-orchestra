// src/db/repositories/testRunRepository.ts
import { Repository } from "../repository";
import { TestRun } from "../../reporting/domain";
import { TestRunRow } from "db/types";

export class TestRunRepository extends Repository<TestRunRow> {
  protected table = "test_runs";

  async createRun(run: TestRun): Promise<number> {
    const result = await this.createReturning<{ id: number }>(
      {
        started_at: run.startedAt,
        finished_at: run.finishedAt ?? null,
        duration_ms: run.durationMs ?? 0
      },
      "id"
    );

    return result.id;
  }
}
