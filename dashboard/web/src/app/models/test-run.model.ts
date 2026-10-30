export interface TestRun {
  id: number;
  started_at: string;
  finished_at: string | null;
  duration_ms: number;
  feature: string;
  scenario: string;
  status: string;
  step_count: number;
}
