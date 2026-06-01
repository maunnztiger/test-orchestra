import { Client } from "pg";
import { PostgresExporter } from "./postgresExporter";
import { JsonExporter } from "./jsonExporter";
import { JunitExporter } from "./junitExporter";

export function createExporter(type: string, options: { dbURL?: string }) {
  if (type === "json") {
    return new JsonExporter();
  }
  console.log("CREATE EXPORTER:", type);
  if (type === "db") {
    if (!options.dbURL) {
      throw new Error("DB_URL is required for db exporter");
    }
    const isLocal = options.dbURL.includes("localhost") || options.dbURL.includes("127.0.0.1");
    const client = new Client({
      connectionString: options.dbURL,
      ssl: isLocal ? false : { rejectUnauthorized: false }
    });

    return new PostgresExporter(client);
  }

  if (type === "junit") {
    return new JunitExporter();
  }

  throw new Error(`Unknown report type: ${type}`);
}
