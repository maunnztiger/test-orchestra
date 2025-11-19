// src/core/markdownparser.ts
import * as fs from "fs";

export interface ParsedStep {
  keyword: string;
  text: string;
  table?: string[][];   // <-- Tabelle optional
  params?: string[];    // <-- optional für {string} etc.
}

const STEP_REGEX = /^\*\*(GEGEBEN|WENN|DANN|UND)\*\*\s*(.+)$/i;

export function parseMarkdownScenario(filePath: string): ParsedStep[] {
  const content = fs.readFileSync(filePath, "utf8");

  // wir trimmen nur Zeilen, filtern aber NICHT alles Leere weg
  const lines = content.split("\n").map(l => l.trim());

  const steps: ParsedStep[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const match = line.match(STEP_REGEX);
    if (!match) continue;

    const keyword = match[1].toUpperCase();
    const text = match[2].trim();

    const step: ParsedStep = { keyword, text };

    // --- nachfolgende Tabellenzeilen einsammeln ---
    const tableLines: string[] = [];
    let j = i + 1;

    while (j < lines.length) {
      const nextLine = lines[j];

      // leere Zeilen unterhalb des Steps ignorieren
      if (nextLine === "") {
        j++;
        continue;
      }

      // nächste Step-Zeile → abbrechen
      if (STEP_REGEX.test(nextLine)) {
        break;
      }

      // Tabellenzeile?
      if (isTableLine(nextLine)) {
        tableLines.push(nextLine);
        j++;
        continue;
      }

      // weder Step, noch Tabelle → abbrechen
      break;
    }

    if (tableLines.length > 0) {
      step.table = parseTable(tableLines);
      i = j - 1; // Tabellenzeilen überspringen
    }

    steps.push(step);
  }

  return steps;
}

function isTableLine(line: string): boolean {
  // einfache Erkennung: beginnt und endet mit "|"
  return line.startsWith("|") && line.endsWith("|");
}

function parseTable(lines: string[]): string[][] {
  const rows = lines.map(line => {
    const inside = line.substring(1, line.length - 1); // äußere Pipes abschneiden
    return inside
      .split("|")
      .map(cell => cell.trim());
  });

  // zweite Zeile als Separator erkennen und rauswerfen (| --- | ---- |)
  if (rows.length >= 2 && isSeparatorRow(rows[1])) {
    return [rows[0], ...rows.slice(2)];
  }

  return rows;
}

function isSeparatorRow(cells: string[]): boolean {
  // sehr simple Erkennung: nur - und :
  return cells.every(c => /^:?-+:?$/.test(c) || c === "");
}
