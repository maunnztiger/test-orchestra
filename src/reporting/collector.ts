// src/reporting/collector.ts

import { TestRun, FeatureResult, ScenarioResult, StepResult, StepStatus } from "./domain";

export class ReportCollector {
  private readonly run: TestRun;
  private currentFeature?: FeatureResult;
  private currentScenario?: ScenarioResult;

  constructor() {
    this.run = {
      startedAt: new Date(),
      features: []
    };
  }

  // --- Run Lifecycle ---

  finishRun() {
    this.run.finishedAt = new Date();
    this.run.durationMs = this.run.finishedAt.getTime() - this.run.startedAt.getTime();
  }

  getRun(): TestRun {
    return this.run;
  }

  // --- Feature Lifecycle ---

  startFeature(name: string, uri: string, tags: string[] = []) {
    this.currentFeature = {
      name,
      uri,
      tags,
      status: "passed",
      durationMs: 0,
      scenarios: []
    };

    this.run.features.push(this.currentFeature);
  }

  finishFeature() {
    this.currentFeature = undefined;
  }

  // --- Scenario Lifecycle ---

  startScenario(name: string, tags: string[] = []) {
    if (!this.currentFeature) {
      throw new Error("No active feature.");
    }

    this.currentScenario = {
      name,
      tags,
      status: "passed",
      durationMs: 0,
      steps: []
    };

    this.currentFeature.scenarios.push(this.currentScenario);
  }

  finishScenario() {
    if (!this.currentScenario || !this.currentFeature) return;

    // propagate scenario status to feature
    if (this.currentScenario.status === "failed") {
      this.currentFeature.status = "failed";
    }

    this.currentFeature.durationMs += this.currentScenario.durationMs;

    this.currentScenario = undefined;
  }

  // --- Step Recording ---

  addStep(step: Omit<StepResult, "status"> & { status: StepStatus }) {
    if (!this.currentScenario) {
      throw new Error("No active scenario.");
    }

    const stepResult: StepResult = {
      ...step
    };

    this.currentScenario.steps.push(stepResult);

    this.currentScenario.durationMs += stepResult.durationMs;

    if (stepResult.status === "failed") {
      this.currentScenario.status = "failed";
    }
  }
}
