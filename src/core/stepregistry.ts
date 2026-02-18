// src/core/stepregistry.ts
import type { CustomWorld } from "../world/customworld";
import type { ParsedStep } from "./markdownparser";

export type StepHandler = (
  world: CustomWorld, 
  ...args: any[]
) => Promise<void> | void;

interface RegisteredStep {
  pattern: string | RegExp;
  handler: StepHandler;
}

class StepRegistryClass {
  private steps: RegisteredStep[] = [];

  register(pattern: string | RegExp, handler: StepHandler) {
    this.steps.push({ pattern, handler });
  }

  async run(world: CustomWorld, step: ParsedStep): Promise<boolean> {
    for (const entry of this.steps) {
      // STRING
      if (typeof entry.pattern === "string") {
        if (entry.pattern === step.text) {
          await entry.handler(world, (step.params ?? []));
          return true;
        }

        // {string} support
        if (entry.pattern.includes("{string}")) {
          const regex = this.buildRegex(entry.pattern);
          const match = step.text.match(regex);
          if (match) {
            step.params = match.slice(1);
            await entry.handler(world, (step.params?? []));
            return true;
          }
        }
      }

      // REGEX
      if (entry.pattern instanceof RegExp) {
        const match = step.text.match(entry.pattern);
        if (match) {
          step.params = match.slice(1);
          await entry.handler(world, (step.params?? []));
          return true;
        }
      }
    }

    return false;
  }

  private buildRegex(pattern: string): RegExp {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Statt (.+) → Quotes explizit behandeln
    const withGroups = escaped.replace(
      /\\\{string\\\}/g,
      '"([^"]+)"'
    );

    return new RegExp("^" + withGroups + "$");
  }
}

export const StepRegistry = new StepRegistryClass();
