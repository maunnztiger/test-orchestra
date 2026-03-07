import { JsonExporter } from "./jsonExporter";
import { PostgresExporter } from "./postgresExporter";
import { ReportExporter } from "./exporter";

export function createExporter(type: string, options: { dbURL?: string } = {}): ReportExporter {
  switch (type) {
    case "json":
      return new JsonExporter();

    case "db":
      if (!process.env.DB_URL) {
        throw new Error("DB_URL is not defined in .env");
      }

      return new PostgresExporter(options.dbURL!);

    default:
      throw new Error(`Unknown report type: ${type}`);
  }
}
