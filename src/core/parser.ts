import fs from "fs";

export interface Step {
  text: string;
  table?: Record<string, string>[]; // Optional: DataTable
}

export function parseMarkdownScenario(filePath: string): Step[][] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  const scenarios: Step[][] = [];
  let currentScenario: Step[] = [];
  let tableBuffer: string[] = [];
  let insideTable = false;

  const flushTable = (): Record<string, string>[] | undefined => {
    if (!tableBuffer.length) return undefined;

    const [headerLine, ...rows] = tableBuffer;
    const headers = headerLine.split("|").map(h => h.trim()).filter(h => h);

    const table = rows
      .map(row => {
        const cells = row.split("|").map(c => c.trim()).filter(c => c);
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = cells[i] ?? "";
        });
        return obj;
      });

    tableBuffer = [];
    insideTable = false;
    return table;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("|")) {
      tableBuffer.push(trimmed);
      insideTable = true;
    } else {
      // Vorherige Tabelle an letzten Step anhängen
      if (insideTable && currentScenario.length) {
        const lastStep = currentScenario[currentScenario.length - 1];
        lastStep.table = flushTable();
      }

      // Scenario-Kennung oder Step
      if (/^(Scenario|Szenario):/i.test(trimmed)) {
        if (currentScenario.length) scenarios.push(currentScenario);
        currentScenario = [];
      } else {
        currentScenario.push({ text: trimmed });
      }
    }
  }

  // Letzte Tabelle anhängen
  if (insideTable && currentScenario.length) {
    currentScenario[currentScenario.length - 1].table = flushTable();
  }

  if (currentScenario.length) scenarios.push(currentScenario);
  return scenarios;
}
