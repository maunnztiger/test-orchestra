import fs from "fs";
import path from "path";

/**
 * Lädt rekursiv alle *.steps.ts (oder *.ts) Dateien
 * damit StepRegistry.register() ausgeführt wird
 */
export function loadStepDefinitions(
  stepsDir = path.resolve(process.cwd(), "src/steps")
) {
  if (!fs.existsSync(stepsDir)) {
    console.warn(`⚠️ Steps-Verzeichnis nicht gefunden: ${stepsDir}`);
    return;
  }

  const entries = fs.readdirSync(stepsDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(stepsDir, entry.name);

    if (entry.isDirectory()) {
      loadStepDefinitions(fullPath);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".steps.ts") || entry.name.endsWith(".ts"))
    ) {
      console.log(`🧩 Lade Step-Definition: ${fullPath}`);
      require(fullPath);
    }
  }
}