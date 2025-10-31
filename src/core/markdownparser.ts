import * as fs from "fs";

export interface Step {
  keyword: string;
  text: string;
}

const keywords = ["GEGEBEN", "WENN", "DANN", "UND", "ABER"];

export function parseMarkdownScenario(filePath: string): Step[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

  const steps: Step[] = [];

  for (const line of lines) {
    const match = new RegExp(`^\\*{0,2}\\s*(${keywords.join("|")})\\s+(.*)`, "i").exec(line);
    if (match) {
      steps.push({
        keyword: match[1].toUpperCase(),
        text: match[2].trim()
      });
    }
  }

  return steps;
}
