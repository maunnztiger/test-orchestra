import { Client } from "pg";
import { PostgresExporter } from "./postgresExporter";
import { JsonExporter } from "./jsonExporter"; // falls du einen hast

export function createExporter(type: string, options: { dbURL?: string }) {
  if (type === "json") {
    return new JsonExporter();
  }
  console.log("CREATE EXPORTER:", type);
  if (type === "db") {
    if (!options.dbURL) {
      throw new Error("DB_URL is required for db exporter");
    }

    const client = new Client({
      connectionString: options.dbURL,
      ssl: { rejectUnauthorized: false }
    });

    return new PostgresExporter(client);
  }

  throw new Error(`Unknown report type: ${type}`);
}
