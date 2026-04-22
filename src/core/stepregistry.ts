// src/core/stepregistry.ts
import type { CustomWorld } from "@world/customworld";
import type { ParsedStep } from "./markdownparser";
import { Table } from "./table";

export type StepArg = string | Table;

export type StepHandler = (this: CustomWorld, ...args: any[]) => Promise<void> | void;
interface RegisteredStep {
  pattern: string | RegExp;
  handler: StepHandler;
}

class StepRegistryClass {
  private steps: RegisteredStep[] = [];

  register(pattern: string | RegExp, handler: StepHandler) {
    // 🔒 Duplicate Pattern Protection

    const exists = this.steps.some(s => s.pattern.toString() === pattern.toString());

    if (exists) {
      throw new Error(`Duplicate step definition detected: ${pattern.toString()}`);
    }

    this.steps.push({ pattern, handler });
  }

  async run(world: CustomWorld, step: ParsedStep): Promise<boolean> {
    const matches: { entry: RegisteredStep; params: string[] }[] = [];

    for (const entry of this.steps) {
  let match: RegExpMatchArray | null = null;

  if (typeof entry.pattern === "string") {
    // exact match
    if (entry.pattern === step.text) {
      matches.push({ entry, params: [] });
      continue;
    }

    // string pattern
    if (entry.pattern.includes("{string}")) {
      
      const regex = this.buildRegex(entry.pattern);
      match = step.text.match(regex);

      if (match) {
        matches.push({
          entry,
          params: match.slice(1)
        });
        continue; // 🔥 WICHTIG
      }
    }
  }

  if (entry.pattern instanceof RegExp) {
    match = step.text.match(entry.pattern);

    if (match) {
      matches.push({
        entry,
        params: match.slice(1)
      });
      continue;
    }
  }
}
  console.log("REGISTERED STEPS:", this.steps.map(s => s.pattern));
    // ❌ No match
    if (matches.length === 0) {
      return false;
    }

    // ❌ Ambiguous match
    if (matches.length > 1) {
      throw new Error(
        `Ambiguous step definition for: "${step.text}"\n` +
          `Matched patterns:\n` +
          matches.map(m => ` - ${m.entry.pattern}`).join("\n")
      );
    }

    const { entry, params } = matches[0];
    const args: StepArg[] = [
      ...(params ?? []),
      ...(step.table ? [step.table] : [])
      ];

      await entry.handler.apply(world, args);

    return true;
  }

 private buildRegex(pattern: string): RegExp {
  // 1. alles escapen
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 2. danach {string} ersetzen
  const final = escaped.replace(/\\\{string\\\}/g, '([^"]+)');

  return new RegExp("^" + final + "$");
}
reset() {
  this.steps = [];
}
}

export const StepRegistry = new StepRegistryClass();
