// src/reporting/domain.ts

export type StepStatus = "passed" | "failed" | "skipped";
export type ScenarioStatus = "passed" | "failed" | "skipped";
export type FeatureStatus = "passed" | "failed" | "skipped";

export interface StepResult {
  keyword: string;
  text: string;
  status: StepStatus;
  durationMs: number;
  error?: string;
}

export interface ScenarioResult {
  name: string;
  tags: string[];
  status: ScenarioStatus;
  durationMs: number;
  steps: StepResult[];
}

export interface FeatureResult {
  name: string;
  uri: string;
  status: FeatureStatus;
  durationMs: number;
  scenarios: ScenarioResult[];
  tags: string[];
}

export interface TestRun {
  startedAt: Date;
  finishedAt?: Date;
  durationMs?: number;
  features: FeatureResult[];
}

