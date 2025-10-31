import { parseMarkdownScenario } from "./core/markdownparser";
import { CustomWorld } from "./world/customworld";
import { StepRunner } from "./core/steprunner";
import * as fs from "fs";
import * as path from "path";

function loadStepDefinitions() {
  const stepsDir = path.resolve(__dirname, "steps");
  const files = fs.readdirSync(stepsDir);

  for (const file of files) {
    if (file.endsWith(".ts")) {
      console.log(`🧩 Lade Step-Definition: ${file}`);
      require(path.join(stepsDir, file));
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
  await runner.run(steps);

  await world.afterAll();
  console.log("✅ Szenario abgeschlossen!");
}
