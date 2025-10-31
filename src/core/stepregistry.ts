import { Page } from "@playwright/test";

export type StepHandler = (page: Page, match: RegExpMatchArray) => Promise<void>;

export class StepRegistryClass {
  private steps: { pattern: RegExp; handler: StepHandler }[] = [];

  register(pattern: RegExp, handler: StepHandler) {
    this.steps.push({ pattern, handler });
  }

  async run(page: Page, text: string) {
    for (const { pattern, handler } of this.steps) {
      const match = text.match(pattern);
      if (match) {
        await handler(page, match);
        return;
      }
    }
    console.warn(`⚠️ Kein Step gefunden für: "${text}"`);
  }

  
}

export const StepRegistry = new StepRegistryClass();

export function GEGEBEN(pattern: string | RegExp, handler: StepHandler) {
  StepRegistry.register(toRegex(pattern), handler);
}

export function WENN(pattern: string | RegExp, handler: StepHandler) {
  StepRegistry.register(toRegex(pattern), handler);
}

export function DANN(pattern: string | RegExp, handler: StepHandler) {
  StepRegistry.register(toRegex(pattern), handler);
}

export function UND(pattern: string | RegExp, handler: StepHandler) {
  StepRegistry.register(toRegex(pattern), handler);
}

function toRegex(pattern: string | RegExp): RegExp {
  if (pattern instanceof RegExp) return pattern;
  return new RegExp(`^${pattern}$`, "i");
}