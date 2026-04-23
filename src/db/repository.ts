// src/db/repository.ts
import { QueryResultRow } from "pg";
import { QueryBuilder } from "./postgres_querybuilder";

export abstract class Repository<T> {
  constructor(protected db: QueryBuilder) {}

  protected abstract table: string;

  async create(data: Partial<T>): Promise<any> {
    return this.db.insert(this.table).values(data).execute();
  }

  async createReturning<R extends QueryResultRow>(data: Partial<T>, returning: string): Promise<R> {
    return this.db.insert(this.table).values(data).execute<R>(returning);
  }
}