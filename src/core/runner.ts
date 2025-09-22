import { stepRegistry } from "./stepRegistry";
import { World } from "./world";
import { parseMarkdownScenario } from "./parser";
import chalk from "chalk";
import fs from "fs";
import * as path from "path";

function detectKeyword(text: string): string {
  if (text.startsWith("**GEGEBEN**")) return "Given";
  if (text.startsWith("**WENN**")) return "When";
  if (text.startsWith("**DANN**")) return "Then";
  if (text.startsWith("**UND**")) return "And";
  if (text.startsWith("**ABER**")) return "But";
  return "";
}

function stripKeyword(text: string): string {
  return text.replace(/\*\*(GEGEBEN|WENN|DANN|UND|ABER)\*\*/i, "").trim();
}

function getStepLocation(pattern: RegExp): string {
  // beim Registrieren könnten wir schon file:line speichern,
  // hier nur Fallback: geben wir das Pattern zurück
  return `pattern: ${pattern.toString()}`;
}

export async function runMarkdownFile(filePath: string) {
  console.log(`\n=== Szenario startet: ${filePath} ===`);

  const scenarios = parseMarkdownScenario(filePath);
  if (!scenarios.length) {
    console.log("⚠️ Keine Steps gefunden!");
    return;
  }

  const cucumberReport: any[] = [];
  const feature = {
    uri: filePath,
    id: path.basename(filePath, ".md").replace(/\s+/g, "-"),
    keyword: "Feature",
    name: path.basename(filePath),
    description: "",
    line: 1,
    elements: [] as any[]
  };

  for (const scenario of scenarios) {
    const world = new World();
    await world.initBrowser();

    const element = {
      id: feature.id + "-scenario-" + Date.now(),
      keyword: "Scenario",
      name: scenario[0]?.text ?? "Unbenanntes Szenario",
      description: "",
      line: 1,
      type: "scenario",
      steps: [] as any[]
    };

    for (const step of scenario) {
      console.log(`\n→ Step: ${step.text}`);
      const start = process.hrtime.bigint();

      let matched = false;
      let stepEntry: any = {
        keyword: detectKeyword(step.text) + " ",
        name: stripKeyword(step.text),
        line: 1,
        match: {},
        result: {}
      };

      for (const { pattern, fn } of stepRegistry) {
        const match = pattern.exec(step.text);
        if (match) {
          matched = true;
          stepEntry.match = { location: getStepLocation(pattern) };
          try {
            if (step.table) {
              await fn(world, step.table, ...(match.groups ? Object.values(match.groups) : []));
            } else {
              await fn(world, ...(match.groups ? Object.values(match.groups) : []));
            }
            console.log(chalk.green("  ✅ erfolgreich"));
            stepEntry.result = {
              status: "passed",
              duration: Number(process.hrtime.bigint() - start)
            };
          } catch (err: any) {
            console.log(chalk.red("  ❌ Fehler:"), err?.message ?? err);
            stepEntry.result = {
              status: "failed",
              error_message: String(err),
              duration: Number(process.hrtime.bigint() - start)
            };
          }
          break;
        }
      }

      if (!matched) {
        console.log(chalk.yellow("  ⚠️ Step nicht gefunden!"));
        stepEntry.result = {
          status: "undefined",
          duration: Number(process.hrtime.bigint() - start)
        };
      }

      element.steps.push(stepEntry);
    }

    await world.closeBrowser();
    feature.elements.push(element);
  }

  cucumberReport.push(feature);

  const reportsDir = path.resolve("report");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, path.basename(filePath, ".md") + ".json");
  fs.writeFileSync(reportPath, JSON.stringify(cucumberReport, null, 2), "utf-8");
  console.log("📄 Cucumber-JSON-Report gespeichert:", reportPath);
}
