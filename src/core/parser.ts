import { readFileSync } from "fs";

export function parseMarkdownScenario(filePath: string): string[][] {
  const content = readFileSync(filePath, "utf-8");

  const lines = content
    .split("\n")
    .map(l => l.trim())
    // Filter nur Lines, die mit Given/When/Then/And/But starten (Markdown ** wird entfernt)
    .filter(l => /^(?:\*\*)?(GEGEBEN|WENN|DANN|UND|ABER|ODER)/i.test(l));

  const scenarios: string[][] = [];
  let current: string[] = [];


  for (const line of lines) {
    // Entferne Markdown-Fett ** und führendes Keyword
    const step = line.replace(/\*\*/g, "").replace(/^(GEGEBEN|WENN|DANN|UND|ABER|ODER)\s+/i, "").trim();
    current.push(step);
  }

  if (current.length > 0) scenarios.push(current);

  return scenarios;
}
