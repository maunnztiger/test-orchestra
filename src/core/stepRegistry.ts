// src/core/stepRegistry.ts
export interface StepDefinition {
  pattern: RegExp;
  fn: (...args: any[]) => Promise<void> | void;
}

export const stepRegistry: StepDefinition[] = [];

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function registerStep(keyword: string, text: string, fn: StepDefinition["fn"]) {
  const pattern = new RegExp(`^\\*\\*${keyword.toUpperCase()}\\*\\*\\s+${escapeRegex(text)}$`, "i");
  stepRegistry.push({ pattern, fn });
}

export const GEGEBEN = (text: string, fn: StepDefinition["fn"]) =>
  registerStep("GEGEBEN", text, fn);
export const WENN = (text: string, fn: StepDefinition["fn"]) =>
  registerStep("WENN", text, fn);
export const DANN = (text: string, fn: StepDefinition["fn"]) =>
  registerStep("DANN", text, fn);
export const UND = (text: string, fn: StepDefinition["fn"]) =>
  registerStep("UND", text, fn);
export const ABER = (text: string, fn: StepDefinition["fn"]) =>
  registerStep("ABER", text, fn);
export const ODER = (text: string, fn: StepDefinition["fn"]) =>
  registerStep("ODER", text, fn);

