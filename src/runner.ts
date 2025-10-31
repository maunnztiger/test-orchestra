import { chromium } from "@playwright/test";
import { parseMarkdownScenario } from "./core/markdownparser.js";
import { StepRegistry } from "./core/stepregistry.js";

// importiere einfach alle Step-Dateien hier
import "../src/steps/login.steps.js";

export async function runScenario(filePath: string) {
  const steps = parseMarkdownScenario(filePath);
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  for (const step of steps) {
    console.log(`➡️ ${step.keyword}: ${step.text}`);
    await StepRegistry.run(page, step.text);
  }

  console.log("✅ Szenario abgeschlossen!");
  await browser.close();
}
