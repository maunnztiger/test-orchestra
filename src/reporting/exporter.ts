import { TestRun } from "./domain";

export interface ReportExporter {
  export(run: TestRun): Promise<void>;
}
