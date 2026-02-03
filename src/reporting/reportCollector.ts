import { ScenarioReport, StepReport } from "./types";

export class ReportCollector {
  private currentScenario?: ScenarioReport;
  private scenarios: ScenarioReport[] = [];

  startScenario(name: string, tags: string[]) {
    this.currentScenario = {
      name,
      tags,
      steps: [],
      status: "passed",
      durationNs: 0,
    };
  }

  addStep(step: StepReport) {
    if (!this.currentScenario) return;

    this.currentScenario.steps.push(step);

    if (step.status === "failed") {
      this.currentScenario.status = "failed";
    }

    this.currentScenario.durationNs += step.durationNs;
  }

  endScenario() {
    if (this.currentScenario) {
      this.scenarios.push(this.currentScenario);
      this.currentScenario = undefined;
    }
  }

  buildFeature(uri: string) {
    return {
      uri,
      scenarios: this.scenarios,
    };
  }
}
