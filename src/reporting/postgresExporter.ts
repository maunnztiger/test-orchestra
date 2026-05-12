import { Client } from "pg";
import { ReportExporter } from "./exporter";
import { TestRun } from "./domain";
import { TestRunService } from "../db/services/testRunService";

export class PostgresExporter implements ReportExporter {
  private readonly service: TestRunService;

  constructor(private client: Client) {
    this.service = new TestRunService(client);
  }

  async export(run: TestRun) {
    await this.client.connect(); // 🔥 DAS FEHLT

    try {
      await this.client.query("BEGIN");

      await this.service.save(run);

      await this.client.query("COMMIT");

      console.log("📄 Report written to `testorchestra_results`-database");
    } catch (err) {
      await this.client.query("ROLLBACK");
      console.error("EXPORT ERROR:", err); // 👈 WICHTIG fürs Debugging
      throw err;
    } finally {
      await this.client.end(); // 🔥 sauber schließen
    }
  }
}
