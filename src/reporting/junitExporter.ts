import * as fs from "fs";
import * as path from "path";

type StepResult = {
  keyword: string;
  text: string;
  status?: string;
  duration_ms?: number;
  error?: string;
};

type ScenarioResult = {
  name: string;
  status?: string;
  duration_ms?: number;
  steps?: StepResult[];
};

type FeatureResult = {
  name: string;
  scenarios?: ScenarioResult[];
};

type TestRunResult = {
  features?: FeatureResult[];
};

export class JunitExporter {
  async export(result: TestRunResult): Promise<void> {
    const reportDir = "reports";
    const reportPath = path.join(reportDir, "junit-report.xml");

    fs.mkdirSync(reportDir, { recursive: true });

    const scenarios =
      result.features?.flatMap(feature =>
        (feature.scenarios ?? []).map(scenario => ({
          featureName: feature.name,
          ...scenario
        }))
      ) ?? [];

    const failures = scenarios.filter(s => s.status === "failed").length;
    const tests = scenarios.length;

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<testsuite name="TestOrchestra" tests="${tests}" failures="${failures}">`,
      ...scenarios.map(scenario => this.renderTestCase(scenario)),
      `</testsuite>`
    ].join("\n");

    fs.writeFileSync(reportPath, xml, "utf8");

    console.log(`📄 JUnit report written to ${reportPath}`);
  }

  private renderTestCase(scenario: ScenarioResult & { featureName: string }): string {
    const time = ((scenario.duration_ms ?? 0) / 1000).toFixed(3);

    if (scenario.status !== "failed") {
      return `  <testcase classname="${this.escapeXml(scenario.featureName)}" name="${this.escapeXml(
        scenario.name
      )}" time="${time}" />`;
    }

    const failedStep = scenario.steps?.find(step => step.status === "failed");
    const message = this.sanitize(failedStep?.error ?? "Scenario failed");
    const details = this.sanitize(
      failedStep ? `${failedStep.keyword} ${failedStep.text}\n\n${failedStep.error ?? ""}` : message
    );

    return [
      `  <testcase classname="${this.escapeXml(scenario.featureName)}" name="${this.escapeXml(
        scenario.name
      )}" time="${time}">`,
      `<failure message="${this.escapeXml(message)}">`,
      this.escapeXml(details),
      `</failure>`,
      `  </testcase>`
    ].join("\n");
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  private sanitize(value: string): string {
    return value.replace(/\u001b\[[0-9;]*m/g, "");
  }
}
