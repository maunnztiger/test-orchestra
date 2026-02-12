// src/core/markdownparser.ts
import * as fs from "fs";

export interface ParsedStep {
  keyword: string;
  text: string;
  table?: string[][]; // <-- Tabelle optional
  params?: string[]; // <-- optional für {string} etc.
}

export interface ParsedScenario {
  name: string;
  tags: string[];
  steps: ParsedStep[];
}
const TAG_REGEX = /^(@[\w-]+(\s+@[\w-]+)*)$/;
const SCENARIO_REGEX = /^##\s*(Szenario|Scenario)\s*:\s*(.+)$/i;

const STEP_REGEX = /^\*\*(GEGEBEN|WENN|DANN|UND)\*\*\s*(.+)$/i;

export function parseMarkdownScenarios(filePath: string): ParsedScenario[] {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n").map(l => l.trim());

  const scenarios: ParsedScenario[] = [];

  let currentTags: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // --- TAGS ---
    if (TAG_REGEX.test(line)) {
      currentTags = line
        .split(/\s+/)
        .filter(t => t.startsWith("@"))
        .map(t => t.substring(1)); // ohne @ speichern
      i++;
      continue;
    }

    // --- SCENARIO ---
    const scenarioMatch = line.match(SCENARIO_REGEX);
    if (scenarioMatch) {
      const scenarioName = scenarioMatch[2].trim();
      const steps: ParsedStep[] = [];

      i++;

      while (i < lines.length) {
        const stepLine = lines[i];

        // nächstes Szenario oder neue Tags → abbrechen
        if (SCENARIO_REGEX.test(stepLine) || TAG_REGEX.test(stepLine)) {
          break;
        }

        const stepMatch = stepLine.match(STEP_REGEX);
        if (!stepMatch) {
          i++;
          continue;
        }

        const keyword = stepMatch[1].toUpperCase();
        const text = stepMatch[2].trim();

        const step: ParsedStep = { keyword, text };

        // --- Tabellen sammeln (dein bestehender Code) ---
        const tableLines: string[] = [];
        let j = i + 1;

        while (j < lines.length) {
          const nextLine = lines[j];

          if (nextLine === "") {
            j++;
            continue;
          }

          if (STEP_REGEX.test(nextLine)) break;
          if (SCENARIO_REGEX.test(nextLine)) break;

          if (isTableLine(nextLine)) {
            tableLines.push(nextLine);
            j++;
            continue;
          }

          break;
        }

        if (tableLines.length > 0) {
          step.table = parseTable(tableLines);
          i = j - 1;
        }

        steps.push(step);
        i++;
      }

      scenarios.push({
        name: scenarioName,
        tags: currentTags,
        steps
      });

      currentTags = []; // ⚠️ wichtig: Tags NICHT vererben
      continue;
    }

    i++;
  }

  return scenarios;
}

function isTableLine(line: string): boolean {
  // einfache Erkennung: beginnt und endet mit "|"
  return line.startsWith("|") && line.endsWith("|");
}

function parseTable(lines: string[]): string[][] {
  const rows = lines.map(line => {
    const inside = line.substring(1, line.length - 1); // äußere Pipes abschneiden
    return inside.split("|").map(cell => cell.trim());
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

export function matchesTagFilter(
  scenarioTags: string[],
  include: string[] = [],
  exclude: string[] = []
): boolean {
  if (include.length && !include.some(t => scenarioTags.includes(t))) {
    return false;
  }

  if (exclude.some(t => scenarioTags.includes(t))) {
    return false;
  }

  return true;
}
