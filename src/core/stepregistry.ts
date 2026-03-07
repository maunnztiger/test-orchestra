// src/core/stepregistry.ts
import type { CustomWorld } from "@world/customworld";
import type { ParsedStep } from "./markdownparser";

<<<<<<< HEAD
export type StepHandler = (
  world: CustomWorld,
  ...args: any[]
) => Promise<void> | void;
=======
export type StepHandler = (world: CustomWorld, ...args: any[]) => Promise<void> | void;
>>>>>>> main

interface RegisteredStep {
  pattern: string | RegExp;
  handler: StepHandler;
}

class StepRegistryClass {
  private steps: RegisteredStep[] = [];

  register(pattern: string | RegExp, handler: StepHandler) {
    // 🔒 Duplicate Pattern Protection
<<<<<<< HEAD
    const exists = this.steps.some(
      s => s.pattern.toString() === pattern.toString()
    );

    if (exists) {
      throw new Error(
        `Duplicate step definition detected: ${pattern.toString()}`
      );
=======
    const exists = this.steps.some(s => s.pattern.toString() === pattern.toString());

    if (exists) {
      throw new Error(`Duplicate step definition detected: ${pattern.toString()}`);
>>>>>>> main
    }

    this.steps.push({ pattern, handler });
  }

  async run(world: CustomWorld, step: ParsedStep): Promise<boolean> {
    const matches: { entry: RegisteredStep; params: string[] }[] = [];

    for (const entry of this.steps) {
      let match: RegExpMatchArray | null = null;

      // STRING PATTERN
      if (typeof entry.pattern === "string") {
<<<<<<< HEAD

=======
>>>>>>> main
        // Exact match
        if (entry.pattern === step.text) {
          matches.push({ entry, params: [] });
          continue;
        }

        // {string} support
        if (entry.pattern.includes("{string}")) {
          const regex = this.buildRegex(entry.pattern);
          match = step.text.match(regex);
        }
      }

      // REGEX PATTERN
      if (entry.pattern instanceof RegExp) {
        match = step.text.match(entry.pattern);
      }

      if (match) {
        matches.push({
          entry,
          params: match.slice(1)
        });
      }
    }

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

    await entry.handler(world, ...params, step.table);

    return true;
  }

  private buildRegex(pattern: string): RegExp {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // {string} → "([^"]+)"
    const withGroups = escaped.replace(/\\\{string\\\}/g, '"([^"]+)"');
    return new RegExp("^" + withGroups + "$");
  }
}

export const StepRegistry = new StepRegistryClass();
