import * as fs from "fs";
import * as path from "path";

import {
  parseMarkdownScenarios,
} from "../core/markdownparser";

import {
  analyzeScenario,
} from "./stepDefinitionAnalyzer";

import {
  generateStepDefinition,
  generateStepDefinitionsFile
} from "./stepDefinitionGenerator";

import {
  findMissingStepDefinitions,
} from "./stepDefinitionMerger";

const scenarioFile = process.argv[2];
const shouldWrite =
  process.argv.includes("--write");
if (!scenarioFile) {
  console.error(
    "❌ Bitte eine Markdown-Szenariodatei angeben."
  );
  process.exit(1);
}

if (!fs.existsSync(scenarioFile)) {
  console.error(
    `❌ Szenariodatei nicht gefunden: ${scenarioFile}`
  );
  process.exit(1);
}

const scenarios =
  parseMarkdownScenarios(scenarioFile);

const definitions = scenarios.flatMap(
  scenario => analyzeScenario(scenario)
);

const scenarioName = path.basename(
  scenarioFile,
  path.extname(scenarioFile)
);

// WICHTIG:
// Wir vergleichen jetzt mit der ECHTEN Step-Datei,
// schreiben aber NICHT hinein.
const stepFile = path.join(
  "src",
  "steps",
  `${scenarioName}.steps.ts`
);

console.log(
  `📄 Szenario: ${scenarioFile}`
);

console.log(
  `🔎 Step-Datei: ${stepFile}`
);

console.log(
  `📊 ${definitions.length} Step Definitions im Markdown`
);

if (!fs.existsSync(stepFile)) {
  console.log(
    "🆕 Step-Datei existiert noch nicht."
  );

  if (!shouldWrite) {
    console.log(
      `➡️ ${definitions.length} Steps würden erzeugt werden.`
    );

    console.log(
      "🛡️ DRY RUN – keine Datei wurde erstellt."
    );

    console.log(
      "💡 Mit --write kann die Step-Datei erstellt werden."
    );

    process.exit(0);
  }

  const output =
    generateStepDefinitionsFile(definitions);

  fs.writeFileSync(
    stepFile,
    output,
    "utf8"
  );

  console.log(
    `✅ Neue Step-Datei mit ${definitions.length} Step Definition(s) erstellt.`
  );

  console.log(
    `➡️  ${stepFile}`
  );

  process.exit(0);
}

const existingContent =
  fs.readFileSync(stepFile, "utf8");

const missingDefinitions =
  findMissingStepDefinitions(
    existingContent,
    definitions
  );

const existingCount =
  definitions.length -
  missingDefinitions.length;

console.log(
  `✅ ${existingCount} Steps bereits vorhanden`
);

console.log(
  `🆕 ${missingDefinitions.length} Steps fehlen`
);

if (missingDefinitions.length === 0) {
  console.log(
    "✨ Keine Änderungen notwendig."
  );

  process.exit(0);
}

console.log(
  "\nFolgende Steps würden hinzugefügt werden:\n"
);

for (const definition of missingDefinitions) {
  console.log(
    generateStepDefinition(definition)
  );

  console.log();
}

if (!shouldWrite) {
  console.log(
    "🛡️ DRY RUN – keine Datei wurde verändert."
  );

  console.log(
    "💡 Mit --write können die fehlenden Steps angehängt werden."
  );

  process.exit(0);
}

const generatedSteps = missingDefinitions
  .map(generateStepDefinition)
  .join("\n\n");

fs.appendFileSync(
  stepFile,
  `\n\n${generatedSteps}\n`,
  "utf8"
);

console.log(
  `✅ ${missingDefinitions.length} fehlende Step Definition(s) wurden angehängt.`
);

console.log(
  `➡️  ${stepFile}`
);