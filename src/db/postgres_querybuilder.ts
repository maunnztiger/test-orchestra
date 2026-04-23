import { Client, QueryResult, QueryResultRow } from "pg";

export class QueryBuilder {
  constructor(private client: Client) {
    
  }

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
    private client: Client,
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

class SelectQuery<T extends QueryResultRow> {
  private table!: string;
  private conditions: string[] = [];
  private params: unknown[] = [];

  constructor(
    private client: Client,
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

  async execute(): Promise<QueryResult<T>> {
    const cols = typeof this.columns === "string" ? this.columns : this.columns.join(", ");

    let sql = `SELECT ${cols} FROM ${this.table}`;

    if (this.conditions.length) {
      sql += ` WHERE ${this.conditions.join(" AND ")}`;
    }

    return this.client.query<T>(sql, this.params);
  }
}
