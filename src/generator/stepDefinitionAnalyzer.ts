import type { ParsedParam, ParsedScenario, ParsedStep } from "../core/markdownparser";

export type StepFunction = "GEGEBEN" | "WENN" | "DANN" | "UND";

export interface GeneratedParameter {
  name: string;
  type: "string" | "number" | "boolean";
}

export interface GeneratedStepDefinition {
  stepFunction: StepFunction;
  pattern: string;
  parameters: GeneratedParameter[];
}

export function analyzeScenario(scenario: ParsedScenario): GeneratedStepDefinition[] {
  return scenario.steps.map(step => analyzeStep(step));
}

function analyzeStep(step: ParsedStep): GeneratedStepDefinition {
  return {
    stepFunction: resolveStepFunction(step.keyword),
    pattern: createPattern(step),
    parameters: createParameters(step.params ?? [], step.text)
  };
}

function resolveStepFunction(keyword: string): StepFunction {
  switch (keyword.toUpperCase()) {
    case "GEGEBEN":
      return "GEGEBEN";

    case "WENN":
      return "WENN";

    case "DANN":
      return "DANN";

    case "UND":
      return "UND";

    default:
      throw new Error(`Unbekanntes Step-Keyword: ${keyword}`);
  }
}

function createPattern(step: ParsedStep): string {
  let pattern = step.text;

  for (const param of step.params ?? []) {
    switch (param.type) {
      case "string":
        pattern = pattern.replace(`"${String(param.value)}"`, "{string}");
        break;

      case "int":
        pattern = pattern.replace(String(param.value), "{int}");
        break;

      case "float":
        pattern = pattern.replace(String(param.value), "{float}");
        break;

      case "boolean":
        pattern = pattern.replace(String(param.value), "{boolean}");
        break;
    }
  }

  return pattern;
}

function createParameters(
  params: ParsedParam[],
  stepText: string
): GeneratedParameter[] {
  return params.map((param, index) => {
    const name = inferParameterName(
      stepText,
      index
    );

    switch (param.type) {
      case "string":
        return {
          name,
          type: "string",
        };

      case "int":
      case "float":
        return {
          name,
          type: "number",
        };

      case "boolean":
        return {
          name,
          type: "boolean",
        };
    }
  });
}

function inferParameterName(
  stepText: string,
  index: number
): string {
  const text = stepText.toLowerCase();

  if (text.includes("filter")) {
    return "filterName";
  }

  if (text.includes("artikel")) {
    return "article";
  }

  if (
    text.includes("produktseite") ||
    text.includes("produkt")
  ) {
    return "productName";
  }

  return `param${index + 1}`;
}