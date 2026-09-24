import { GeneratedStepDefinition } from "./stepDefinitionAnalyzer";

export function findMissingStepDefinitions(
  existingContent: string,
  definitions: GeneratedStepDefinition[],
  ): GeneratedStepDefinition[]{
    return definitions.filter(definition => {
      return !stepExists(
        existingContent,
        definition
      );
    });
  }

  function stepExists(existingContent:string,
    definition: GeneratedStepDefinition
  ): boolean {
    const pattern = JSON.stringify(definition.pattern);

    return existingContent.includes(pattern)
  }