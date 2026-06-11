import { Client } from "pg";
import { PostgresExporter } from "./postgresExporter";
import { JsonExporter } from "./jsonExporter";
import { JunitExporter } from "./junitExporter";
import { XrayJsonExporter } from "./xrayJsonExporter";
import { RobotXmlExporter } from "./robotXmlExporter";

export function createExporter(type: string, options: { dbURL?: string }) {
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

  if (type === "xray") {
    return new XrayJsonExporter();
  }

  if (type === "json") {
    return new JsonExporter();
  }

  if (type === "robot") {
    return new RobotXmlExporter();
  }

  throw new Error(`Unknown report type: ${type}`);
}
