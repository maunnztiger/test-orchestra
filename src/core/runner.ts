import { World } from "./world"; // importiere die Klasse
import { beforeAllHooks, afterEachHooks } from "./hooks";
import { parseMarkdownScenario } from "./parser";
import { stepRegistry } from "./stepRegistry";
import chalk from "chalk"

export async function runMarkdownFile(filePath: string) {
  const scenarios = parseMarkdownScenario(filePath);
for (const scenario of scenarios) {
  console.log(`\n=== Szenario startet: ${filePath} ===`);
  const world = new World(); // NEUE World-Instanz pro Szenario
  await world.initBrowser(); // Browser pro Szenario starten

  for (const hook of beforeAllHooks) await hook();

  for (const stepText of scenario) {
    let matched = false;
    for (const { pattern, fn } of stepRegistry) {
      const match = pattern.exec(stepText);
      if (match) {
        matched = true;
        const args = match.groups ? Object.values(match.groups) : [];
        process.stdout.write(`→ ${stepText} ... `);
        try {
            const start = Date.now();
            await fn(world, ...args);
            const duration = Date.now() - start;
            console.log(chalk.green(`✅ (${duration}ms)`));
          } catch (err) {
            console.log(chalk.red(`❌`));
            if (err instanceof Error) {
            console.error(chalk.red(`   Fehler: ${err.message}`));
            } else {
            console.error(chalk.red(`   Fehler: ${err}`));
  }
          }
        break;
      }
    }
    if (!matched) console.log(chalk.yellow(`⚠️ Step nicht gefunden: "${stepText}"`));
  }

  await world.closeBrowser();
 console.log(`=== Fertig: ${filePath} ===\n`); // Browser nach Szenario schließen
}

}
