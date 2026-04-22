import { describe, it, expect, vi } from "vitest";
import { QueryBuilder } from "../src/db/postgres_querybuilder";
import { mockClient } from "./helpers/mockClient";

describe("QueryBuilder", () => {
  it("should build INSERT query", async () => {
    const client = mockClient();
    const qb = new QueryBuilder(client as any);

    await qb
      .insert("test_runs")
      .values({
        started_at: "now",
        duration_ms: 123
      })
      .execute();

    expect(client.query).toHaveBeenCalledTimes(1);
    const [sql, params] = client.query.mock.calls[0];

    expect(sql).toContain("INSERT INTO test_runs");
    expect(sql).toContain("started_at");
    expect(sql).toContain("duration_ms");

    expect(params).toEqual(["now", 123]);
  });

  it("should return inserted row when using RETURNING", async () => {
    const client = {
      query: vi.fn().mockResolvedValue({
        rows: [{ id: 42 }]
      })
    };

    const qb = new QueryBuilder(client as any);

    const result = await qb
      .insert("test_runs")
      .values({ duration_ms: 100 })
      .execute<{ id: number }>("id");

    expect(result.id).toBe(42);
  });

  it("should build SELECT query", async () => {
    const client = mockClient();
    const qb = new QueryBuilder(client as any);

    await qb.select("*").from("test_runs").execute();

    const [sql] = client.query.mock.calls[0];

    expect(sql).toContain("SELECT * FROM test_runs");
  });

  it("should build WHERE clause correctly", async () => {
    const client = mockClient();
    const qb = new QueryBuilder(client as any);

    await qb.select("*").from("test_runs").where("id", 5).where("status", "passed").execute();

    const [sql, params] = client.query.mock.calls[0];

    expect(sql).toContain("WHERE id = $1 AND status = $2");
    expect(params).toEqual([5, "passed"]);
  });

  it("should work without WHERE", async () => {
    const client = mockClient();
    const qb = new QueryBuilder(client as any);

    await qb.select("*").from("test_runs").execute();

    const [sql] = client.query.mock.calls[0];

    expect(sql).not.toContain("WHERE");
  });

  it("should throw if returning but no rows", async () => {
    const client = {
      query: vi.fn().mockResolvedValue({ rows: [] })
    };

    const qb = new QueryBuilder(client as any);

    await expect(qb.insert("test_runs").values({ duration_ms: 1 }).execute("id")).rejects.toThrow();
  });
});
