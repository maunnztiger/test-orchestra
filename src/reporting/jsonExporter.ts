import fs from "fs";
import { TestRun } from "./domian";
import { CucumberJsonExporter } from "./cucumberExporter";
import { ReportExporter } from "./exporter";

export class JsonExporter implements ReportExporter {
  constructor(private file = "./reports/cucumber-report.json") {}

  async export(run: TestRun) {
    const cucumberExporter = new CucumberJsonExporter();

    const json = cucumberExporter.export(run);

    fs.writeFileSync(this.file, JSON.stringify(json, null, 2));

    console.log(`📄 Report written to ${this.file}`);
  }
}
