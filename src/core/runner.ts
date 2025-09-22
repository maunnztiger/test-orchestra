import { stepRegistry } from "./stepRegistry";
import { World } from "./world";
import { parseMarkdownScenario, Step } from "./parser";
import chalk from "chalk";
import fs from "fs";

export async function runMarkdownFile(filePath: string) {
  console.log(`\n=== Szenario startet: ${filePath} ===`);
  const scenarios = parseMarkdownScenario(filePath);

  if (!scenarios.length) {
    console.log("⚠️ Keine Steps gefunden!");
    return;
  }

  for (const scenario of scenarios) {
    const world = new World();
    await world.initBrowser();

    for (const step of scenario) {
      let matched = false;
      console.log(`\n→ Step: ${step.text}`);
      for (const { pattern, fn } of stepRegistry) {
        const match = pattern.exec(step.text);
        if (match) {
          matched = true;
          const args = match.groups ? Object.values(match.groups) : [];
          try {
            if (step.table) {
              await fn(world, step.table, ...args);
            } else {
              await fn(world, ...args);
            }
            console.log(chalk.green(`  ✅ erfolgreich`));
          } catch (err: any) {
            console.log(chalk.red(`  ❌ Fehler:`), err?.message ?? err);
          }
          break;
        }
      }
      if (!matched) console.log(chalk.yellow(`  ⚠️ Step nicht gefunden!`));
    }

    await world.closeBrowser();
  }
}

export async function runAllScenarios(scenariosDir: string) {
  const files = fs.readdirSync(scenariosDir).filter(f => f.endsWith(".md"));
  for (const file of files) {
    await runMarkdownFile(`${scenariosDir}/${file}`);
  }
}
