import { StepRegistry } from "./stepregistry";
import type { CustomWorld } from "../world/customworld";

/**
 * Ein einzelner Step (aus Markdown geparst)
 */
export interface ParsedStep {
  keyword: string;
  text: string;
}

/**
 * Führt alle Steps in Reihenfolge aus.
 */
export class StepRunner {
  constructor(private world: CustomWorld) {}

  async run(steps: ParsedStep[]) {
    console.log(`\n🧪 Starte Step-Runner mit ${steps.length} Steps\n`);

    let index = 1;

    for (const step of steps) {
      console.log(`➡️  [${index}] ${step.keyword.toUpperCase()} ${step.text}`);
      try {
        // StepRegistry.run() MUSS ein Promise<boolean> zurückgeben
        const matched: boolean = await StepRegistry.run(this.world, step.text);

        // Warnung nur, wenn KEIN Match gefunden wurde
        if (!matched) {
          console.warn(`⚠️ Kein Step-Match für: "${step.text}"`);
        }
      } catch (err) {
        console.error(`❌ Fehler bei Step "${step.text}":`, err);
        throw err;
      }

      index++;
    }

    console.log("\n✅ Alle Steps ausgeführt.\n");
  }
}
