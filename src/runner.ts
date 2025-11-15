import { parseMarkdownScenario } from "./core/markdownparser";
import { CustomWorld } from "./world/customworld";
import { StepRunner } from "./core/steprunner";
import * as fs from "fs";
import * as path from "path";

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
  await runner.run(steps);

  await world.afterAll();
  console.log("✅ Szenario abgeschlossen!");
}
