export type StepStatus = "passed" | "failed" | "skipped";

export interface StepResult {
  keyword: string;
  name: string; // step.text
  status: StepStatus;
  duration: number; // in nanoseconds (wie Cucumber)
  error_message?: string;
}

export interface ScenarioResult {
  name: string;
  keyword: string; // "Scenario"
  steps: StepResult[];
}

export interface FeatureResult {
  uri: string; // z.B. Pfad zur Markdown-Datei
  name: string;
  elements: ScenarioResult[];
}
