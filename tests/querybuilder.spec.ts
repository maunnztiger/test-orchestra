import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryBuilder } from "@testorchestra/database";
import { mockClient } from "./helpers/mockClient";

let client: ReturnType<typeof mockClient>;
let qb: QueryBuilder;

beforeEach(() => {
  client = mockClient();
  qb = new QueryBuilder(client as any);
});
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
    await expect(qb.insert("test_runs").values({ duration_ms: 1 }).execute("id")).rejects.toThrow();
  });

  it("should build INNER JOIN query", async () => {
    await qb.select("*").from("test_runs tr").join("features f", "f.run_id = tr.id").execute();

    expect(client.query).toHaveBeenCalledWith(
      "SELECT * FROM test_runs tr INNER JOIN features f ON f.run_id = tr.id",
      []
    );
  });

  it("should build LEFT JOIN query", async () => {
    await qb.select("*").from("test_runs tr").leftJoin("features f", "f.run_id = tr.id").execute();

    expect(client.query).toHaveBeenCalledWith(
      "SELECT * FROM test_runs tr LEFT JOIN features f ON f.run_id = tr.id",
      []
    );
  });

  it("should build GROUP BY query", async () => {
    await qb.select(["status", "COUNT(*) AS total"]).from("test_runs").groupBy("status").execute();

    expect(client.query).toHaveBeenCalledWith(
      "SELECT status, COUNT(*) AS total FROM test_runs GROUP BY status",
      []
    );
  });

  it("should build ORDER BY query", async () => {
    await qb.select("*").from("test_runs").orderBy("started_at", "DESC").execute();

    expect(client.query).toHaveBeenCalledWith(
      "SELECT * FROM test_runs ORDER BY started_at DESC",
      []
    );
  });

  it("should build LIMIT query", async () => {
    await qb.select("*").from("test_runs").limit(10).execute();

    expect(client.query).toHaveBeenCalledWith("SELECT * FROM test_runs LIMIT $1", [10]);
  });

  it("should reject a negative LIMIT", () => {
    expect(() => qb.select("*").from("test_runs").limit(-1)).toThrow(
      "LIMIT must be a non-negative safe integer"
    );
  });

  it("should not duplicate LIMIT parameters on repeated execution", async () => {
    const query = qb.select("*").from("test_runs").where("status", "passed").limit(10);

    await query.execute();
    await query.execute();

    expect(client.query).toHaveBeenCalledTimes(2);

    expect(client.query).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM test_runs WHERE status = $1 LIMIT $2",
      ["passed", 10]
    );

    expect(client.query).toHaveBeenNthCalledWith(
      2,
      "SELECT * FROM test_runs WHERE status = $1 LIMIT $2",
      ["passed", 10]
    );
  });
});
