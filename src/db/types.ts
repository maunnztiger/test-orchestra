// src/db/types.ts

export type TestRunRow = {
  id?: number;
  started_at: Date;
  finished_at: Date | null;
  duration_ms: number;
};

export type FeatureRow = {
  id?: number;
  test_run_id: number;
  name: string;
  uri: string;
  status: string;
  duration_ms: number;
};

export type ScenarioRow = {
  id?: number;
  feature_id: number;
  name: string;
  status: string;
  duration_ms: number;
};

export type ScenarioTagRow = {
  scenario_id: number;
  tag: string;
};