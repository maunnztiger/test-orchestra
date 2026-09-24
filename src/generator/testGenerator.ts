import * as fs from "fs";
import path from "path";
import { parseMarkdownScenarios } from "../core/markdownparser";

import { analyzeScenario } from "./stepDefinitonAnalyzer";

import { generateStepDefinitionsFile } from "./stepDefinitonGenerator";
import { fstat } from "fs";

const scenarioFile = "scenarios/filters.md";

const scenarios = parseMarkdownScenarios(scenarioFile);

for (const scenario of scenarios) {
  console.log(`\nSCENARIO: ${scenario.name}\n`);

  const definitions = analyzeScenario(scenario);

  const output = generateStepDefinitionsFile(definitions);

  const outputPath = path.join("src", "steps", "filters.generated.steps.ts");

  fs.writeFileSync(outputPath, output, "utf-8");

  console.log(`Step Definitions erzeugt ${outputPath}`);
}
