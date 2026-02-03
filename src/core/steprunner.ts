import { StepRegistry } from "./stepregistry";
import type { CustomWorld } from "../world/customworld";
import type { ParsedStep } from "./markdownparser";
import type { StepResult, StepStatus } from "./reportiing";
import { ReportCollector } from "reporting/reportCollector";

export class StepRunner {
  constructor(
    private world: CustomWorld,
    private report: ReportCollector
  ) {}

  async run(steps: ParsedStep[]): Promise<StepResult[]> {
    console.log(`\n🧪 Starte Step-Runner mit ${steps.length} Steps\n`);
    const results: StepResult[] = []
    let index = 1;

    for (const step of steps) {

      const start = process.hrtime.bigint(); // hohe Auflösung
      let status: "passed" | "failed" = "passed";
      let error: string | undefined;
      try {
        const matched: boolean = await StepRegistry.run(this.world, step);
        if (!matched) {
          status = "failed";
          error = `No step definition found for "${step.text}"`
        }
      } catch (err: any) {
        status = "failed";
        error = err?.stack || err?.message || String(err)
        throw err;
      }
      const end = process.hrtime.bigint();
      const durationNs = Number(end-start);

      this.report.addStep({
        keyword: step.keyword,
        text: step.text,
        status,
        durationNs,
        error,
      });   

      index++;
    }
    return results;
  }

  private mapKeyword(keyword: string): string {
    // Deine Keywords sind GEGEBEN/WENN/DANN/UND
    // im Report wollen wir "Given ", "When ", "Then ", "And "
    switch (keyword.toUpperCase()) {
      case "GEGEBEN":
        return "Given ";
      case "WENN":
        return "When ";
      case "DANN":
        return "Then ";
      case "UND":
        return "And ";
      default:
        return keyword + " ";
    }
  }
}
