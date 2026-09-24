import {
  parseMarkdownScenarios,
} from "../core/markdownparser";

import {
  analyzeScenario,
} from "./stepDefinitonAnalyzer";

import {
  generateStepDefinitionsFile,
} from "./stepDefinitonGenerator";

const scenarioFile =
  "scenarios/filters.md";

const scenarios =
  parseMarkdownScenarios(scenarioFile);

for (const scenario of scenarios) {
  console.log(
    `\nSCENARIO: ${scenario.name}\n`
  );

  const definitions =
    analyzeScenario(scenario);

  const output =
    generateStepDefinitionsFile(
      definitions
    );

  console.log(output);
}