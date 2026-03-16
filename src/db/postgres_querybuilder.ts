import { Client, QueryResultRow } from "pg";

export class QueryBuilder {
  constructor(private client: Client) {}

  insert(table: string) {
    return new InsertQuery(this.client, table);
  }

  select(columns: string | string[]) {
    return new SelectQuery(this.client, columns);
  }
}

class InsertQuery {
  private data: Record<string, any> = {};
  private returningColumn?: string;

  constructor(
    private client: Client,
    private table: string
  ) {}

  values(data: Record<string, any>) {
    this.data = data;
    return this;
  }

  async execute(): Promise<void>;
  async execute<T extends QueryResultRow>(returning: string): Promise<T>;
  async execute<T extends QueryResultRow>(returning?: string): Promise<T | void> {
    const columns = Object.keys(this.data);
    const values = Object.values(this.data);
    const placeholders = columns.map((_, i) => `$${i + 1}`);

    let sql = `
    INSERT INTO ${this.table} (${columns.join(", ")})
    VALUES (${placeholders.join(", ")})
  `;

    if (returning) {
      sql += ` RETURNING ${returning}`;
      const result = await this.client.query<T>(sql, values);
      if (!result.rows[0]) throw new Error(`INSERT into ${this.table} returned no rows`);
      return result.rows[0];
    }

    await this.client.query(sql, values);
  }
}

class SelectQuery {
  private table!: string;
  private conditions: string[] = [];
  private params: any[] = [];

  constructor(
    private client: Client,
    private columns: string | string[]
  ) {}

  from(table: string) {
    this.table = table;
    return this;
  }

  where(column: string, value: any) {
    const index = this.params.length + 1;

    this.conditions.push(`${column} = $${index}`);
    this.params.push(value);

    return this;
  }

  async execute() {
    const cols = typeof this.columns === "string" ? this.columns : this.columns.join(", ");

    let sql = `SELECT ${cols} FROM ${this.table}`;

    if (this.conditions.length) {
      sql += ` WHERE ${this.conditions.join(" AND ")}`;
    }

    return this.client.query(sql, this.params);
  }
}
