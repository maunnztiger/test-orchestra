import * as fs from "fs";
import { Table } from "./table";

export interface ParsedStep {
  keyword: string;
  text: string;
  table?: Table;
  params?: unknown[]; // 🔥 jetzt typed params
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
        .map(t => t.substring(1));
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

        const step: ParsedStep = {
          keyword,
          text,
          params: extractParams(text) // 🔥 HIER passiert die Magie
        };

        // --- Tabellen ---
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
          step.table = new Table(parseTable(tableLines));
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

      currentTags = [];
      continue;
    }

    i++;
  }

  return scenarios;
}

function isTableLine(line: string): boolean {
  return line.startsWith("|") && line.endsWith("|");
}

function parseTable(lines: string[]): string[][] {
  const rows = lines.map(line => {
    const inside = line.substring(1, line.length - 1);
    return inside.split("|").map(cell => cell.trim());
  });

  if (rows.length >= 2 && isSeparatorRow(rows[1])) {
    return [rows[0], ...rows.slice(2)];
  }

  return rows;
}

function isSeparatorRow(cells: string[]): boolean {
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

//
// 🔥 NEU: PARAM PARSING
//

function extractParams(text: string): unknown[] {
  const params: unknown[] = [];

  // Zahlen (int + float)
  const numberRegex = /-?\d+(?:\.\d+)?/g;

  // Strings in Quotes
  const stringRegex = /"([^"]*)"/g;

  // Booleans
  const boolRegex = /\b(true|false)\b/gi;

  // --- Strings zuerst (wichtig wegen Zahlen in Strings!) ---
  let match;
  while ((match = stringRegex.exec(text)) !== null) {
    params.push(match[1]);
  }

  // --- Zahlen ---
  while ((match = numberRegex.exec(text)) !== null) {
    const raw = match[0];

    if (raw.includes(".")) {
      params.push(parseFloat(raw));
    } else {
      params.push(parseInt(raw, 10));
    }
  }

  // --- Booleans ---
  while ((match = boolRegex.exec(text)) !== null) {
    params.push(match[0].toLowerCase() === "true");
  }

  return params;
}
