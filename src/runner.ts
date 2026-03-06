import { parseMarkdownScenario } from "@core/markdownparser";
import { CustomWorld } from "@world/customworld";
import { StepRunner } from "@core/steprunner";
import * as fs from "fs";
import * as path from "path";
import { FeatureResult, ScenarioResult } from "@core/reporting";

function loadStepDefinitions(dir = path.resolve(__dirname, "steps")) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadStepDefinitions(fullPath); // 🔁 Rekursion
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      console.log(`🧩 Lade Step-Definition: ${path.relative(process.cwd(), fullPath)}`);
      require(fullPath);
    }
  }
}

export async function runScenario(filePath: string) {
  loadStepDefinitions();
  const steps = parseMarkdownScenario(filePath);

  if (!steps.length) {
    console.warn("⚠️ Keine Steps im Szenario gefunden!");
    return;
  }
  console.log("🧾 Parsed Steps:");
  for (const s of steps) {
    console.log(`   keyword="${s.keyword}" | text="${s.text}"`);
  }
  const world = new CustomWorld();
  await world.beforeAll();

  const runner = new StepRunner(world);
  const stepResults = await runner.run(steps);

  await world.afterAll();
  console.log("✅ Szenario abgeschlossen!");

  const scenarioName = path.basename(filePath, path.extname(filePath));
  const scenarioResult: ScenarioResult = {
    name: scenarioName,
    keyword: "Scenario",
    steps: stepResults
  };

  const featureResult: FeatureResult = {
    uri: filePath,
    name: scenarioName, // du kannst hier auch einen anderen Namen nehmen
    elements: [scenarioResult]
  };

  const cucumberJson = [featureResult]; // Cucumber-Report ist ein Array von Features

  // --- report.json schreiben ---
  const reportDir = path.resolve(process.cwd(), "reports");
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const outputPath = path.join(reportDir, "report.json");
  fs.writeFileSync(outputPath, JSON.stringify(cucumberJson, null, 2), "utf-8");

  console.log(`📄 Cucumber-Style Report geschrieben nach: ${outputPath}`);
}
