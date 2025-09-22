import { World } from "./world"; // importiere die Klasse
import { parseMarkdownScenario } from "./parser";
import { stepRegistry } from "./stepRegistry";
import path from 'path'
import fs from 'fs'
import { generateHtmlReport} from './generateReportHTML'
import { generateLogsHtml } from "./generateLogsHtml";

function getTimestampFolder() {
  const now = new Date();
  const folderName = now
    .toISOString()
    .replace(/:/g, "-") // keine Doppelpunkte, sonst Windows-Problem
    .replace(/\..+/, ""); // Millisekunden weg
  return path.resolve("reports", folderName);
}

export async function runMarkdownFile(filePath: string) {
  const scenarios = parseMarkdownScenario(filePath);
  const report: any[] = [];
  const reportFolder = getTimestampFolder();
  fs.mkdirSync(reportFolder, { recursive: true });

 for (const scenario of scenarios) {
    console.log(`\n=== Szenario startet: ${filePath} ===`);
    const world = new World();
    await world.initBrowser();

    const scenarioResult = {
      scenario: path.basename(filePath),
      steps: [] as any[],
    };

    for (const stepText of scenario) {
      let matched = false;
      let stepStart = Date.now();

      for (const { pattern, fn } of stepRegistry) {
        const match = pattern.exec(stepText);
        if (match) {
          matched = true;
          const args = match.groups ? Object.values(match.groups) : [];

          try {
            await fn(world, ...args);
            scenarioResult.steps.push({
              text: stepText,
              status: "passed",
              durationMs: Date.now() - stepStart,
            });
            console.log(`✅ ${stepText}`);
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            scenarioResult.steps.push({
              text: stepText,
              status: "failed",
              error: message,
              durationMs: Date.now() - stepStart,
            });

            // Optional Screenshot bei Fehler
            try {
              const screenshotPath = path.join(
                reportFolder,
                `screenshot-${Date.now()}.png`
              );
              await world.page.screenshot({ path: screenshotPath });
              scenarioResult.steps[scenarioResult.steps.length - 1].screenshot =
                screenshotPath;
            } catch (_) {
              // Screenshot fehlgeschlagen, kein Problem
            }

            console.error(`❌ Fehler in Step "${stepText}": ${message}`);
          }
          break;
        }
      }

      if (!matched) {
        scenarioResult.steps.push({
          text: stepText,
          status: "undefined",
        });
        console.error(`⚠️ Step nicht gefunden: "${stepText}"`);
      }
    }

    report.push(scenarioResult);
    await world.closeBrowser();
  }

  // JSON-Report in Timestamp-Ordner speichern
  const reportPath = path.join(reportFolder, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  generateHtmlReport(reportPath)
  generateLogsHtml(reportPath)
  console.log(`📄 Report gespeichert: ${reportPath}`);
}
