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

type FlattenedScenario = ScenarioResult & {
  featureName: string;
};

export class JunitExporter {
  async export(result: TestRunResult): Promise<void> {
    const reportDir = "reports";
    const reportPath = path.join(reportDir, "junit-report.xml");

    fs.mkdirSync(reportDir, { recursive: true });

    const scenarios = this.flattenScenarios(result);

    const tests = scenarios.length;
    const failures = scenarios.filter(s => s.status === "failed").length;
    const skipped = scenarios.filter(s => s.status === "skipped").length;
    const errors = 0;
    const totalTime = this.toSeconds(
      scenarios.reduce((sum, scenario) => sum + (scenario.duration_ms ?? 0), 0)
    );

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<testsuites tests="${tests}" failures="${failures}" errors="${errors}" skipped="${skipped}" time="${totalTime}">`,
      `  <testsuite name="TestOrchestra" tests="${tests}" failures="${failures}" errors="${errors}" skipped="${skipped}" time="${totalTime}" timestamp="${new Date().toISOString()}">`,
      this.renderProperties(),
      ...scenarios.map(scenario => this.renderTestCase(scenario)),
      `  </testsuite>`,
      `</testsuites>`
    ].join("\n");

    fs.writeFileSync(reportPath, xml, "utf8");

    console.log(`📄 JUnit report written to ${reportPath}`);
  }

  private flattenScenarios(result: TestRunResult): FlattenedScenario[] {
    return (
      result.features?.flatMap(feature =>
        (feature.scenarios ?? []).map(scenario => ({
          featureName: feature.name,
          ...scenario
        }))
      ) ?? []
    );
  }

  private renderProperties(): string {
    return [
      `    <properties>`,
      `      <property name="framework" value="TestOrchestra" />`,
      `      <property name="reporter" value="junit" />`,
      `      <property name="generatedAt" value="${this.escapeXml(new Date().toISOString())}" />`,
      `      <property name="nodeVersion" value="${this.escapeXml(process.version)}" />`,
      `      <property name="platform" value="${this.escapeXml(process.platform)}" />`,
      `      <property name="ci" value="${this.escapeXml(process.env.CI ?? "false")}" />`,
      `      <property name="branch" value="${this.escapeXml(
        process.env.GITHUB_REF_NAME ?? process.env.BRANCH_NAME ?? "local"
      )}" />`,
      `      <property name="commit" value="${this.escapeXml(
        process.env.GITHUB_SHA ?? process.env.COMMIT_SHA ?? "local"
      )}" />`,
      `    </properties>`
    ].join("\n");
  }

  private renderTestCase(scenario: FlattenedScenario): string {
    const time = this.toSeconds(scenario.duration_ms ?? 0);

    if (scenario.status === "skipped") {
      return [
        `    <testcase classname="${this.escapeXml(scenario.featureName)}" name="${this.escapeXml(
          scenario.name
        )}" time="${time}">`,
        `      <skipped message="Scenario skipped" />`,
        this.renderSystemOut(scenario),
        `    </testcase>`
      ].join("\n");
    }

    if (scenario.status !== "failed") {
      return [
        `    <testcase classname="${this.escapeXml(scenario.featureName)}" name="${this.escapeXml(
          scenario.name
        )}" time="${time}">`,
        this.renderSystemOut(scenario),
        `    </testcase>`
      ].join("\n");
    }

    const failedStep = scenario.steps?.find(step => step.status === "failed");

    const message = this.sanitize(failedStep?.error ?? "Scenario failed");
    const failureDetails = this.sanitize(
      [
        `FAILED SCENARIO: ${scenario.name}`,
        `FEATURE: ${scenario.featureName}`,
        ``,
        failedStep
          ? `FAILED STEP:\n${failedStep.keyword} ${failedStep.text}`
          : `FAILED STEP:\nUnknown`,
        ``,
        `ERROR:`,
        failedStep?.error ?? "Scenario failed"
      ].join("\n")
    );

    return [
      `    <testcase classname="${this.escapeXml(scenario.featureName)}" name="${this.escapeXml(
        scenario.name
      )}" time="${time}">`,
      `      <failure message="${this.escapeXml(message)}" type="AssertionError">`,
      this.indent(this.escapeXml(failureDetails), 8),
      `      </failure>`,
      this.renderSystemOut(scenario),
      `    </testcase>`
    ].join("\n");
  }

  private renderSystemOut(scenario: FlattenedScenario): string {
    const steps = scenario.steps ?? [];

    const content = this.sanitize(
      [
        `FEATURE: ${scenario.featureName}`,
        `SCENARIO: ${scenario.name}`,
        `STATUS: ${scenario.status ?? "unknown"}`,
        `DURATION_MS: ${scenario.duration_ms ?? 0}`,
        ``,
        `STEPS:`,
        ...steps.map(step => {
          const status = (step.status ?? "unknown").toUpperCase();
          const duration = step.duration_ms ?? 0;
          const base = `[${status}] ${step.keyword} ${step.text} (${duration} ms)`;

          if (step.error) {
            return `${base}\nERROR:\n${step.error}`;
          }

          return base;
        })
      ].join("\n")
    );

    return [
      `      <system-out>`,
      this.indent(this.escapeXml(content), 8),
      `      </system-out>`
    ].join("\n");
  }

  private toSeconds(durationMs: number): string {
    return (durationMs / 1000).toFixed(3);
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

  private indent(value: string, spaces: number): string {
    const prefix = " ".repeat(spaces);
    return value
      .split("\n")
      .map(line => `${prefix}${line}`)
      .join("\n");
  }
}
