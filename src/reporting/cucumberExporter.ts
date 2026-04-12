// src/reporting/cucumberExporter.ts

import { TestRun, FeatureResult, ScenarioResult, StepResult } from "./domain";

// 🔥 Cucumber Types

interface CucumberTag {
  name: string;
}

interface CucumberStepResult {
  status: "passed" | "failed" | "skipped";
  duration: number;
  error_message?: string;
}

interface CucumberStep {
  keyword: string;
  name: string;
  result: CucumberStepResult;
}

interface CucumberScenario {
  name: string;
  keyword: "Scenario";
  tags: CucumberTag[];
  steps: CucumberStep[];
}

interface CucumberFeature {
  uri: string;
  name: string;
  elements: CucumberScenario[];
}

export class CucumberJsonExporter {
  export(run: TestRun): CucumberFeature[] {
    return run.features.map(f => this.mapFeature(f));
  }

  private mapFeature(feature: FeatureResult): CucumberFeature {
    return {
      uri: feature.uri,
      name: feature.name,
      elements: feature.scenarios.map(s => this.mapScenario(s))
    };
  }

  private mapScenario(scenario: ScenarioResult): CucumberScenario {
    return {
      name: scenario.name,
      keyword: "Scenario",
      tags: scenario.tags.map(tag => ({
        name: tag.startsWith("@") ? tag : `@${tag}`
      })),
      steps: scenario.steps.map(step => this.mapStep(step))
    };
  }

  private mapStep(step: StepResult): CucumberStep {
    return {
      keyword: step.keyword + " ",
      name: step.text,
      result: {
        status: this.normalizeStatus(step.status),
        duration: (step.durationMs ?? 0) * 1_000_000,
        error_message: step.error || undefined
      }
    };
  }

  /**
   * 🔥 sorgt dafür, dass wir cucumber-kompatibel bleiben
   */
  private normalizeStatus(status: StepResult["status"]): "passed" | "failed" | "skipped" {
    if (status === "passed") return "passed";
    if (status === "failed") return "failed";
    return "skipped";
  }
}
