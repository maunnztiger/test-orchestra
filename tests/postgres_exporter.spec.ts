import { describe, it, expect, vi, beforeEach } from "vitest";
import { PostgresExporter } from "../src/reporting/postgresExporter";
import type { TestRun } from "../src/reporting/domain";

function createMockClient() {
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    query: vi.fn().mockResolvedValue({ rows: [{ id: 1 }] }),
    end: vi.fn().mockResolvedValue(undefined)
  };
}

const fakeRun: TestRun = {
  startedAt: new Date(),
  finishedAt: null,
  durationMs: 123,
  features: [
    {
      name: "Login Feature",
      uri: "test.feature",
      status: "passed",
      durationMs: 100,
      scenarios: [
        {
          name: "Login success",
          status: "passed",
          durationMs: 50,
          tags: [],
          steps: [
            {
              keyword: "WENN",
              text: "step 1",
              status: "passed",
              durationMs: 10,
              error: null
            }
          ]
        }
      ],
      tags: []
    }
  ]
};

describe("PostgresExporter", () => {
  let client: ReturnType<typeof createMockClient>;
  let exporter: PostgresExporter;

  beforeEach(() => {
    client = createMockClient();
    exporter = new PostgresExporter(client as any);
  });

  it("should wrap export in transaction", async () => {
    await exporter.export(fakeRun);

    const calls = client.query.mock.calls.map(c => c[0]);

    expect(client.connect).toHaveBeenCalled();

    expect(calls[0]).toBe("BEGIN");
    expect(calls).toContain("COMMIT");
    expect(client.end).toHaveBeenCalled();
  });

  it("should insert run before features and steps", async () => {
    await exporter.export(fakeRun);

    const calls = client.query.mock.calls.map(c => c[0]);

    const runInsertIndex = calls.findIndex(sql => sql.includes("INSERT INTO test_runs"));

    const featureInsertIndex = calls.findIndex(sql => sql.includes("INSERT INTO features"));

    expect(runInsertIndex).toBeGreaterThan(-1);
    expect(featureInsertIndex).toBeGreaterThan(-1);

    expect(runInsertIndex).toBeLessThan(featureInsertIndex);
  });
});
