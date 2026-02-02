import fs from "fs";
import path from "path";
import { parseMarkdownScenarios } from "./core/markdownparser";
import { matchesTagFilter } from "./core/markdownparser";
import { StepRunner } from "./core/steprunner";
import { CustomWorld } from "./world/customworld";

export async function runScenariosFromPath(
  inputPath: string,
  opts: {
    includeTags: string[];
    excludeTags: string[];
  }
) {
  const files = collectMarkdownFiles(inputPath);

  if (!files.length) {
    console.warn("⚠️ No markdown scenarios found");
    return;
  }

  for (const file of files) {
    console.log(`\n📄 File: ${file}`);
    const scenarios = parseMarkdownScenarios(file);

    const selected = scenarios.filter(s =>
      matchesTagFilter(s.tags, opts.includeTags, opts.excludeTags)
    );

    console.log(
      `🎯 ${selected.length}/${scenarios.length} scenarios selected`
    );

    for (const scenario of selected) {
      console.log(`\n▶ Scenario: ${scenario.name}`);
      console.log(`🏷️  ${scenario.tags.join(", ") || "-"}`);

      const world = new CustomWorld();
      await world.beforeAll();

      const runner = new StepRunner(world);
      await runner.run(scenario.steps);

      await world.afterAll();
    }
  }
}

function collectMarkdownFiles(p: string): string[] {
  const stat = fs.statSync(p);

  if (stat.isFile() && p.endsWith(".md")) {
    return [p];
  }

  if (stat.isDirectory()) {
    return fs
      .readdirSync(p)
      .flatMap(entry =>
        collectMarkdownFiles(path.join(p, entry))
      );
  }

  return [];
}
