import { Client, Pool, QueryResult, QueryResultRow } from "pg";

type DataBaseClient = Client | Pool;

export class QueryBuilder {
  constructor(private client: DataBaseClient) {}

  insert<T extends Record<string, unknown>>(table: string) {
    return new InsertQuery<T>(this.client, table);
  }

  select<T extends QueryResultRow = QueryResultRow>(columns: string | string[]) {
    return new SelectQuery<T>(this.client, columns);
  }
}

class InsertQuery<T extends Record<string, unknown>> {
  private data!: T;

  constructor(
    private client: DataBaseClient,
    private table: string
  ) {}

  values(data: T) {
    this.data = data;
    return this;
  }

  async execute(): Promise<void>;
  async execute<R extends QueryResultRow>(returning: string): Promise<R>;

  async execute<R extends QueryResultRow>(returning?: string): Promise<R | void> {
    const columns = Object.keys(this.data);
    const values = Object.values(this.data);

    const placeholders = columns.map((_, i) => `$${i + 1}`);

    let sql = `
      INSERT INTO ${this.table} (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
    `;

    if (returning) {
      sql += ` RETURNING ${returning}`;
      const result = await this.client.query<R>(sql, values);

      if (!result.rows[0]) {
        throw new Error(`INSERT into ${this.table} returned no rows`);
      }

      return result.rows[0];
    }

    await this.client.query(sql, values);
  }
}

type SortDirection = "ASC" | "DESC";

class SelectQuery<T extends QueryResultRow> {
  private table!: string;
  private conditions: string[] = [];
  private params: unknown[] = [];
  private joins: string[] = [];
  private groupByColumns: string[] = [];
  private orderByClause?: string;
  private limitValue?: number;

  constructor(
    private client: DataBaseClient,
    private columns: string | string[]
  ) {}

  from(table: string) {
    this.table = table;
    return this;
  }

  where(column: string, value: unknown) {
    const index = this.params.length + 1;

    this.conditions.push(`${column} = $${index}`);
    this.params.push(value);

    return this;
  }

  join(table: string, condition: string) {
    this.joins.push(`INNER JOIN ${table} ON ${condition}`);

    return this;
  }

  leftJoin(table: string, condition: string) {
    this.joins.push(`LEFT JOIN ${table} ON ${condition}`);
    return this;
  }

  groupBy(columns: string | string[]) {
    const values = Array.isArray(columns) ? columns : [columns];
    this.groupByColumns.push(...values);
    return this;
  }

  orderBy(column: string, direction: SortDirection = "ASC") {
    this.orderByClause = `ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(value: number) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new Error("LIMIT must be a non-negative safe integer");
    }
    this.limitValue = value;
    return this;
  }

  async execute(): Promise<QueryResult<T>> {
    const cols = typeof this.columns === "string" ? this.columns : this.columns.join(", ");

    let sql = `SELECT ${cols} FROM ${this.table}`;
    const params = [...this.params];

    if (this.joins.length) {
      sql += ` ${this.joins.join(" ")}`;
    }
    if (this.conditions.length) {
      sql += ` WHERE ${this.conditions.join(" AND ")}`;
    }
    if (this.groupByColumns.length) {
      sql += ` GROUP BY ${this.groupByColumns.join(", ")}`;
    }
    if (this.orderByClause) {
      sql += ` ${this.orderByClause}`;
    }
    if (this.limitValue != undefined) {
      const index = this.params.length + 1;
      sql += ` LIMIT $${index}`;
      params.push(this.limitValue);
    }

    return this.client.query<T>(sql, params);
  }
}
