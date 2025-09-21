import { WorldType } from "./world";

export type StepFunction = (world: WorldType, ...args: any[]) => void | Promise<void>;

interface StepEntry {
  pattern: RegExp;
  fn: StepFunction;
}

export const stepRegistry: StepEntry[] = [];
export function registerStep(pattern: string, fn: StepFunction) {
  // Unicode-fähige Regex: \w ersetzt durch .+
  const fullPattern = "^" + pattern.replace(/\{(\w+)\}/g, "(?<$1>.+)") + "$";

  // 'u' Flag für Unicode, 'i' für Case-Insensitive
  const regex = new RegExp(fullPattern, "iu");

  stepRegistry.push({ pattern: regex, fn });
}

export const Given = (p: string, fn: StepFunction) => registerStep(p, fn);
export const When  = (p: string, fn: StepFunction) => registerStep(p, fn);
export const Then  = (p: string, fn: StepFunction) => registerStep(p, fn);
export const And   = (p: string, fn: StepFunction) => registerStep(p, fn);
export const But   = (p: string, fn: StepFunction) => registerStep(p, fn);
