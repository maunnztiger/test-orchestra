export type StepStatus = "passed" | "failed" | "skipped";

export interface StepReport {
  keyword: string;
  text: string;
  status: StepStatus;
  durationNs: number;
  error?: string;
}

export interface ScenarioReport {
  name: string;
  tags: string[];
  steps: StepReport[];
  status: StepStatus;
  durationNs: number;
}

export interface FeatureReport {
  uri: string;
  scenarios: ScenarioReport[];
}
