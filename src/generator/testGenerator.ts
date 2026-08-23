import * as fs from "fs";
import * as path from "path";

import { parseMarkdownScenarios } from "../parser/markdownparser";
import { analyzeScenario } from "./stepDefinitionAnalyzer";
import { generateStepDefinitionsFile } from "./stepDefinitonGenerator";

const scenarioFile = "scenarios/filters.md";

const scenarios = parseMarkdownScenarios(scenarioFile);

for (const scenario of scenarios) {
  const definitions = analyzeScenario(scenario);

  const output = generateStepDefinitionsFile(definitions);

  const outputPath = path.join(
    "src",
    "steps",
    "filters.generated.ts"
  );

  fs.writeFileSync(outputPath, output, "utf8");

  console.log(`✅ Step Definitions erzeugt: ${outputPath}`);
}