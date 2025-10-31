// src/core/markdownparser.ts
import * as fs from "fs";

export interface ParsedStep {
  keyword: string;
  text: string;
}

export function parseMarkdownScenario(filePath: string): ParsedStep[] {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);

  const steps: ParsedStep[] = [];
  const keywords = ["GEGEBEN", "WENN", "DANN", "UND"];

  for (const line of lines) {
    // Nur Zeilen mit Step-Keyword verarbeiten
    const match = line.match(/^\*\*(GEGEBEN|WENN|DANN|UND)\*\*\s*(.+)$/i);
    if (match) {
      const keyword = match[1].toUpperCase();
      const text = match[2].trim();
      steps.push({ keyword, text });
    }
  }

  return steps;
}
