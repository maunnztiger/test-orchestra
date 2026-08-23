import type {
  GeneratedStepDefinition,
} from "./stepDefinitionAnalyzer";

export function generateStepDefinitionsFile(
  definitions: GeneratedStepDefinition[]
): string {
  const steps = definitions
    .map(generateStepDefinition)
    .join("\n\n");

  return `import { GEGEBEN, WENN, DANN, UND } from "./utils/stepApi";
import { CustomWorld } from "../world/customworld";

${steps}
`;
}

function generateStepDefinition(
  definition: GeneratedStepDefinition
): string {
  const params = definition.parameters
    .map(param => `${param.name}: ${param.type}`)
    .join(", ");

  const functionParams = params
    ? `this: CustomWorld, ${params}`
    : "this: CustomWorld";

  return `${definition.stepFunction}(
  ${JSON.stringify(definition.pattern)},
  async function (${functionParams}) {
    throw new Error("Not implemented");
  }
);`;
}

function indent(
  value: string,
  spaces: number
): string {
  const prefix = " ".repeat(spaces);

  return value
    .split("\n")
    .map(line => line.length > 0 ? prefix + line : line)
    .join("\n");
}