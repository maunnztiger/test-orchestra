// src/core/stepregistry.ts
import type { CustomWorld } from "@world/customworld";
import type { ParsedStep } from "./markdownparser";
import { Table } from "./table";

export type StepArg = string | number | boolean | Table;

export type StepHandler = (this: CustomWorld, ...args: any[]) => Promise<void> | void;

interface RegisteredStep {
  pattern: string | RegExp;
  handler: StepHandler;
}

class StepRegistryClass {
  private steps: RegisteredStep[] = [];
  private paramTypes: Record<
  string,
  { regex: string; parse: (v: string) => any }
> = {
  string: {
    regex: '"([^"]+)"',
    parse: (v) => v
  },
  int: {
    regex: '(-?\\d+)',
    parse: (v) => parseInt(v, 10)
  },
  float: {
    regex: '(-?\\d+\\.\\d+)',
    parse: (v) => parseFloat(v)
  },
  boolean: {
    regex: '(true|false)',
    parse: (v) => v === "true"
  }
};

defineParamType(
  name: string,
  config: { regex: string; parse: (v: string) => any }
) {
  if (this.paramTypes[name]) {
    throw new Error(`Param type already exists: ${name}`);
  }

  this.paramTypes[name] = config;
}

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
        if (typeof entry.pattern === "string" && entry.pattern.includes("{")) {
          const { regex, parsers } = this.buildRegex(entry.pattern);
          const match = step.text.match(regex);

          if (match) {
            const rawParams = match.slice(1);

            const typedParams = rawParams.map((val, i) => {
              const parser = parsers[i];
              return parser ? parser(val) : val;
            });

            matches.push({
              entry,
              params: typedParams
            });

            continue;
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
    // 🔥 HIER IST DER WICHTIGE FIX
    const finalParams: StepArg[] =
      step.params && step.params.length > 0
        ? (step.params as StepArg[]) // 🔥 cast
        : (params as StepArg[]);

    const args: StepArg[] = [...(finalParams ?? []), ...(step.table ? [step.table] : [])];
    await entry.handler.apply(world, args);

    return true;
  }

  private buildRegex(pattern: string): { regex: RegExp; parsers: ((v: string) => any)[] } {
    const parsers: ((v: string) => any)[] = [];

    // Escape nur normalen Text (ohne unsere placeholders)
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Split in Text + {param}
    const parts = pattern.split(/(\{\w+\})/g);

    let regexStr = "^";

    for (const part of parts) {
      const match = part.match(/^\{(\w+)\}$/);

      if (match) {
        const type = match[1];

        const def = this.paramTypes[type];

if (!def) {
  throw new Error(`Unknown placeholder: {${type}}`);
}

regexStr += def.regex;
parsers.push(def.parse);
      } else {
        regexStr += escapeRegex(part);
      }
    }

    regexStr += "$";

    return {
      regex: new RegExp(regexStr),
      parsers
    };
  }
  reset() {
  this.steps = [];

  // optional: default types neu setzen
  this.paramTypes = {
    string: {
      regex: '"([^"]+)"',
      parse: (v) => v
    },
    int: {
      regex: '(-?\\d+)',
      parse: (v) => parseInt(v, 10)
    },
    float: {
      regex: '(-?\\d+\\.\\d+)',
      parse: (v) => parseFloat(v)
    },
    boolean: {
      regex: '(true|false)',
      parse: (v) => v === "true"
    }
  };
}
}

export const StepRegistry = new StepRegistryClass();
