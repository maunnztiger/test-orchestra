import fs from "fs";
import path from "path";
import { TestRun } from "./domain";
import { CucumberJsonExporter } from "./cucumberExporter";
import { ReportExporter } from "./exporter";

export class JsonExporter implements ReportExporter {
  constructor(private file = "./reports/cucumber-report.json") {
    const dir = path.dirname(this.file);
    fs.mkdirSync(dir, { recursive: true });
  }

  async export(run: TestRun) {
    const cucumberExporter = new CucumberJsonExporter();

    const json = cucumberExporter.export(run);

    fs.writeFileSync(this.file, JSON.stringify(json, null, 2));

    console.log(`📄 Report written to ${this.file}`);
  }
}
