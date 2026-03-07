import { TestRun } from "./domian";

export interface ReportExporter {
  export(run: TestRun): Promise<void>;
}