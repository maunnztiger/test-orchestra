import type { CustomWorld } from "../world/customworld";

export type StepHandler = (world: CustomWorld, ...args: any[]) => Promise<void>;

interface RegisteredStep {
  pattern: RegExp;
  handler: StepHandler;
}

class StepRegistryClass {
  private steps: RegisteredStep[] = []; // ← KEIN static mehr

  register(pattern: string | RegExp, handler: StepHandler) {
    const regex = compilePattern(pattern);
    this.steps.push({ pattern: regex, handler });
  }

  async run(world: CustomWorld, text: string): Promise<boolean> {
    for (const { pattern, handler } of this.steps) {
      const match = text.match(pattern);
      if (match) {
        const args = match.slice(1);
        await handler(world, ...args);
        return true; // Step gefunden
      }
    }
    return false; // Kein Match
  }
}

export const StepRegistry = new StepRegistryClass();

/** DSL-Funktionen für GEGEBEN, WENN, DANN, UND */
export function GEGEBEN(pattern: string | RegExp, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}
export function WENN(pattern: string | RegExp, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}
export function DANN(pattern: string | RegExp, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}
export function UND(pattern: string | RegExp, handler: StepHandler) {
  StepRegistry.register(pattern, handler);
}

/** Hilfsfunktion: Platzhalter in Regex umwandeln */
function compilePattern(pattern: string | RegExp): RegExp {
  if (pattern instanceof RegExp) return pattern;

  let src = pattern;
  src = src.replace(/\{string\}/g, "<<STRING>>")
           .replace(/\{int\}/g, "<<INT>>")
           .replace(/\{float\}/g, "<<FLOAT>>")
           .replace(/\{word\}/g, "<<WORD>>");

  src = escapeRegExp(src)
    .replace(/<<STRING>>/g, '"([^"]+)"')
    .replace(/<<INT>>/g, "(\\d+)")
    .replace(/<<FLOAT>>/g, "([0-9]*\\.?[0-9]+)")
    .replace(/<<WORD>>/g, "(\\w+)");

  return new RegExp(`^${src}$`, "i");
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
