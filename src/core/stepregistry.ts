// src/core/stepregistry.ts
import type { CustomWorld } from "../world/customworld";
import type { ParsedStep } from "./markdownparser";

export type StepHandler = (world: CustomWorld, step: ParsedStep) => Promise<void> | void;

interface RegisteredStep {
  pattern: string;
  handler: StepHandler;
}

class StepRegistryClass {
  private steps: RegisteredStep[] = [];

  register(pattern: string, handler: StepHandler) {
    this.steps.push({ pattern, handler });
  }

  async run(world: CustomWorld, step: ParsedStep): Promise<boolean> {
    for (const entry of this.steps) {
      // 1) Exakter Text-Match
      if (entry.pattern === step.text) {
        await entry.handler(world, step);
        return true;
      }

      // 2) Cucumber-artiger Pattern-Match mit {string}
      if (entry.pattern.includes("{string}")) {
        const regex = this.buildRegex(entry.pattern);
        const match = step.text.match(regex);

        if (match) {
          // Parameter in step.params ablegen
          step.params = match.slice(1);
          await entry.handler(world, step);
          return true;
        }
      }
    }

    return false;
  }

  private buildRegex(pattern: string): RegExp {
    // Alle Regex-Sonderzeichen escapen
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // {string} → (.+)
    const withGroups = escaped.replace(/\\\{string\\\}/g, "(.+)");

    return new RegExp("^" + withGroups + "$");
  }
}

export const StepRegistry = new StepRegistryClass();
