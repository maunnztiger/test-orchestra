// src/core/steprunner.ts
import { StepRegistry } from "./stepregistry";
import type { CustomWorld } from "@world/customworld";
import type { ParsedStep } from "./markdownparser";
import type { StepResult, StepStatus } from "./reporting";
import { ReportCollector } from "reporting/collector";
export class StepRunner {
  constructor(
    private world: CustomWorld,
    private collector: ReportCollector
  ) {}
  async run(steps: ParsedStep[]) {
    let index = 1;

    for (const step of steps) {
      console.log(`➡️  [${index}] ${step.keyword} ${step.text}`);
      const start = Date.now();
      let status: "passed" | "failed" = "passed";
      let error: string | undefined;

      try {
        const matched = await StepRegistry.run(this.world, step);

        if (!matched) {
          status = "failed";
          error = `No step definition found for: ${step.text}`;

       }
      } catch (err: any) {
        status = "failed";
        error = err?.message ?? String(err);
      }

      const durationMs = Date.now() - start;

      this.collector.addStep({
        keyword: step.keyword,
        text: step.text,
        status,
        durationMs,
        error
      });

      if (status === "failed") {
        break; // fail fast (optional)
      }

      index++;
    }
  }
}
