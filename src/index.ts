// src/index.ts
import fs from "fs";
import path from "path";
import { runMarkdownFile } from "./core/runner";
import { printReport } from "./core/reporter";

// 1️⃣ Config laden
const configPath = path.resolve("./test-orchestra.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// 2️⃣ Steps dynamisch importieren (rekursiv)
async function importSteps(dir: string) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      await importSteps(fullPath); // Rekursion für Unterordner
    } else if (f.isFile() && f.name.endsWith(".steps.ts")) {
      await import(fullPath);
      console.log(`✅ Step-File geladen: ${fullPath}`);
    }
  }
}

// 3️⃣ Szenarios rekursiv sammeln
function getScenarioFiles(dir: string): string[] {
  let results: string[] = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      results = results.concat(getScenarioFiles(fullPath));
    } else if (f.isFile() && f.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

// 4️⃣ CLI-Argumente (optional einzelne Dateien)
const args = process.argv.slice(2);

(async () => {
  console.log("🚀 Test-Orchestra gestartet");

  // Steps registrieren
  await importSteps(path.resolve(config.steps));

  // Szenarios
  const scenarioFiles = args.length > 0
    ? args.map(f => path.resolve(f))
    : getScenarioFiles(path.resolve(config.scenarios));

  console.log(`📂 Lade Szenarios: ${scenarioFiles.join(", ")}\n`);

  for (const file of scenarioFiles) {
    try {
      await runMarkdownFile(file);
    } catch (err) {
      console.error(`❌ Fehler beim Ausführen von ${file}:`, err);
    }
  }
  for (const file of scenarioFiles) {
  try {
    await runMarkdownFile(file);
    const reportPath = path.resolve(
      "report",
      path.basename(file, ".md") + ".json"
    );
    printReport(reportPath);
  } catch (err) {
    console.error(`❌ Fehler beim Ausführen von ${file}:`, err);
  }
}

  console.log("\n🏁 Alle Szenarios abgeschlossen!");
})();
