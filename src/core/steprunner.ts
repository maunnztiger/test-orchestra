// src/core/steprunner.ts
import { StepRegistry } from "./stepregistry";
import type { CustomWorld } from "@world/customworld";
import type { ParsedStep } from "./markdownparser";
import type { StepResult, StepStatus } from "./reporting";
import { resourceLimits } from "worker_threads";

export class StepRunner {
  constructor(private world: CustomWorld) {}

  async run(steps: ParsedStep[]): Promise<StepResult[]> {
    console.log(`\n🧪 Starte Step-Runner mit ${steps.length} Steps\n`);
    const results: StepResult[] = [];
    let index = 1;

    for (const step of steps) {
      console.log(`➡️  [${index}] ${step.keyword.toUpperCase()} ${step.text}`);
      const start = process.hrtime.bigint(); // hohe Auflösung
      let status: StepStatus = "passed";
      let error_message: string | undefined;
      try {
        const matched: boolean = await StepRegistry.run(this.world, step);
        if (!matched) {
          console.warn(`⚠️ Kein Step-Match für: "${step.text}"`);
          status = "failed";
          error_message = `No step definition found for "${step.text}"`;
        }
      } catch (err: any) {
        console.error(`❌ Fehler bei Step "${step.text}":`, err);
        status = "failed";
        error_message = err?.stack || err?.message || String(err);
        throw err;
      }
      const end = process.hrtime.bigint();
      const durationNs = Number(end - start);

      results.push({
        keyword: this.mapKeyword(step.keyword),
        name: step.text,
        status,
        duration: durationNs,
        ...(error_message ? { error_message } : {})
      });

      index++;
    }

    console.log("\n✅ Alle Steps ausgeführt.\n");
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
