// src/reporting/cucumberExporter.ts

import { TestRun, FeatureResult, ScenarioResult, StepResult } from "./domian";

export class CucumberJsonExporter {
  export(run: TestRun): any[] {
    return run.features.map(feature => this.mapFeature(feature));
  }

  private mapFeature(feature: FeatureResult) {
    return {
      uri: feature.uri,
      name: feature.name,
      elements: feature.scenarios.map(s => this.mapScenario(s))
    };
  }

  private mapScenario(scenario: ScenarioResult) {
    return {
      name: scenario.name,
      keyword: "Scenario",
      tags: scenario.tags.map(tag => ({
        name: tag.startsWith("@") ? tag : `@${tag}`
      })),
      steps: scenario.steps.map(step => this.mapStep(step))
    };
  }

  private mapStep(step: StepResult) {
    return {
      keyword: step.keyword + " ",
      name: step.text,
      result: {
        status: step.status,
        duration: step.durationMs * 1_000_000,
        // Cucumber erwartet Nanosekunden
        error_message: step.error
      }
    };
  }
}
