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

export class RobotXmlExporter {
  async export(result: TestRunResult): Promise<void> {
    const reportDir = "reports";
    const reportPath = path.join(reportDir, "robot-output.xml");

    fs.mkdirSync(reportDir, { recursive: true });

    const scenarios = this.flattenScenarios(result);
    const generated = new Date().toISOString();

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<robot generator="TestOrchestra" generated="${generated}" rpa="false" schemaversion="5">`,
      `  <suite id="s1" name="TestOrchestra" source="test-orchestra">`,
      ...this.renderFeatureSuites(scenarios),
      this.renderStatistics(scenarios),
      `  </suite>`,
      `</robot>`
    ].join("\n");

    fs.writeFileSync(reportPath, xml, "utf8");

    console.log(`🤖 Robot XML report written to ${reportPath}`);
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

  private renderFeatureSuites(scenarios: FlattenedScenario[]): string[] {
    const grouped = new Map<string, FlattenedScenario[]>();

    for (const scenario of scenarios) {
      const list = grouped.get(scenario.featureName) ?? [];
      list.push(scenario);
      grouped.set(scenario.featureName, list);
    }

    let suiteIndex = 1;
    const lines: string[] = [];

    for (const [featureName, featureScenarios] of grouped.entries()) {
      const suiteId = `s1-s${suiteIndex}`;

      lines.push(`    <suite id="${suiteId}" name="${this.escapeXml(featureName)}">`);

      featureScenarios.forEach((scenario, index) => {
        lines.push(...this.renderTestCase(scenario, `${suiteId}-t${index + 1}`));
      });

      lines.push(this.renderSuiteStatus(featureScenarios, 6));
      lines.push(`    </suite>`);

      suiteIndex += 1;
    }

    return lines;
  }

  private renderTestCase(scenario: FlattenedScenario, testId: string): string[] {
    const status = this.mapStatus(scenario.status);
    const lines: string[] = [];

    lines.push(`      <test id="${testId}" name="${this.escapeXml(scenario.name)}">`);
    lines.push(`        <doc>${this.escapeXml(`Feature: ${scenario.featureName}`)}</doc>`);

    for (const step of scenario.steps ?? []) {
      lines.push(...this.renderKeyword(step));
    }

    if (scenario.status === "failed") {
      const failedStep = scenario.steps?.find(step => step.status === "failed");
      const message = this.sanitize(failedStep?.error ?? "Scenario failed");

      lines.push(`        <msg timestamp="${this.robotTimestamp()}" level="FAIL">`);
      lines.push(this.indent(this.escapeXml(message), 10));
      lines.push(`        </msg>`);
    }

    lines.push(
      `        <status status="${status}" elapsed="${this.toSeconds(scenario.duration_ms ?? 0)}">`
    );

    if (scenario.status === "failed") {
      const failedStep = scenario.steps?.find(step => step.status === "failed");
      const message = this.sanitize(failedStep?.error ?? "Scenario failed");
      lines.push(this.indent(this.escapeXml(message), 10));
    }

    lines.push(`        </status>`);
    lines.push(`      </test>`);

    return lines;
  }

  private renderKeyword(step: StepResult): string[] {
    const status = this.mapStatus(step.status);
    const keywordName = `${step.keyword} ${step.text}`;
    const elapsed = this.toSeconds(step.duration_ms ?? 0);

    const lines = [
      `        <kw name="${this.escapeXml(keywordName)}" owner="TestOrchestra">`,
      `          <doc>${this.escapeXml(keywordName)}</doc>`
    ];

    if (step.error) {
      const message = this.sanitize(step.error);

      lines.push(`          <msg timestamp="${this.robotTimestamp()}" level="FAIL">`);
      lines.push(this.indent(this.escapeXml(message), 12));
      lines.push(`          </msg>`);
    }

    lines.push(`          <status status="${status}" elapsed="${elapsed}">`);

    if (step.error) {
      lines.push(this.indent(this.escapeXml(this.sanitize(step.error)), 12));
    }

    lines.push(`          </status>`);
    lines.push(`        </kw>`);

    return lines;
  }

  private renderSuiteStatus(scenarios: FlattenedScenario[], indentSize: number): string {
    const hasFailure = scenarios.some(scenario => scenario.status === "failed");
    const status = hasFailure ? "FAIL" : "PASS";

    return `${" ".repeat(indentSize)}<status status="${status}" elapsed="${this.toSeconds(
      this.sumDuration(scenarios)
    )}" />`;
  }

  private renderStatistics(scenarios: FlattenedScenario[]): string {
    const passed = scenarios.filter(scenario => scenario.status === "passed").length;
    const failed = scenarios.filter(scenario => scenario.status === "failed").length;
    const total = scenarios.length;

    return [
      `    <statistics>`,
      `      <total>`,
      `        <stat pass="${passed}" fail="${failed}" skip="0">All Tests</stat>`,
      `      </total>`,
      `      <tag>`,
      `      </tag>`,
      `      <suite>`,
      `        <stat name="TestOrchestra" id="s1" pass="${passed}" fail="${failed}" skip="0">TestOrchestra</stat>`,
      `      </suite>`,
      `    </statistics>`,
      `    <errors>`,
      `    </errors>`
    ].join("\n");
  }

  private sumDuration(scenarios: FlattenedScenario[]): number {
    return scenarios.reduce((sum, scenario) => sum + (scenario.duration_ms ?? 0), 0);
  }

  private mapStatus(status?: string): "PASS" | "FAIL" | "SKIP" {
    if (status === "passed") {
      return "PASS";
    }

    if (status === "failed") {
      return "FAIL";
    }

    if (status === "skipped") {
      return "SKIP";
    }

    return "PASS";
  }

  private toSeconds(durationMs: number): string {
    return (durationMs / 1000).toFixed(3);
  }

  private robotTimestamp(): string {
    return new Date()
      .toISOString()
      .replace("T", " ")
      .replace("Z", "")
      .replace(/\.\d+$/, "");
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
