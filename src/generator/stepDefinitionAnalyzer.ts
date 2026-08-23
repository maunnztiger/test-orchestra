import type {
  ParsedParam,
  ParsedStep,
  ParsedScenario,
} from "../parser/markdownparser";


export type StepFunction =
  | "GEGEBEN"
  | "WENN"
  | "DANN"
  | "UND";

export interface GeneratedParameter {
  name: string;
  type: "string" | "number" | "boolean";
}
export interface GeneratedStepDefinition {
  stepFunction: StepFunction;
  pattern: string;
  parameters: GeneratedParameter[];
}

export function analyzeScenario(
  scenario: ParsedScenario
): GeneratedStepDefinition[] {
  return scenario.steps.map(step => analyzeStep(step));
}

function analyzeStep(
  step: ParsedStep
): GeneratedStepDefinition {
  return {
    stepFunction: resolveStepFunction(step.keyword),
    pattern: createPattern(step),
    parameters: createParameters(step.params ?? []),
  };
}

function resolveStepFunction(
  keyword: string
): StepFunction {
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
      throw new Error(
        `Unbekanntes Step-Keyword: ${keyword}`
      );
  }
}

function createPattern(step: ParsedStep): string {
  let pattern = step.text;

  for (const param of (step.params ?? []) as ParsedParam[]) {
    switch (param.type) {
      case "string":
        pattern = pattern.replace(
          `"${String(param.value)}"`,
          "{string}"
        );
        break;

      case "int":
        pattern = pattern.replace(
          String(param.value),
          "{int}"
        );
        break;

      case "float":
        pattern = pattern.replace(
          String(param.value),
          "{float}"
        );
        break;

      case "boolean":
        pattern = pattern.replace(
          String(param.value),
          "{boolean}"
        );
        break;
    }
  }

  return pattern;
}

function createParameters(
  params: ParsedParam[]
): GeneratedParameter[] {
  return params.map((param, index) => {
    switch (param.type) {
      case "string":
        return {
          name: `param${index + 1}`,
          type: "string",
        };

      case "int":
      case "float":
        return {
          name: `param${index + 1}`,
          type: "number",
        };

      case "boolean":
        return {
          name: `param${index + 1}`,
          type: "boolean",
        };

      default:
        throw new Error(
          `Nicht unterstützter Parameter-Typ: ${(param as ParsedParam).type}`
        );
    }
  });
}