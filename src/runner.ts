import fs from "fs";
import path from "path";
import { parseMarkdownScenarios, matchesTagFilter } from "./core/markdownparser";
import { StepRunner } from "./core/steprunner";
import { CustomWorld } from "./world/customworld";
import { ReportCollector } from "./reporting/collector";

export async function runScenariosFromPath(
  inputPath: string,
  opts: {
    includeTags: string[];
    excludeTags: string[];
  }
) {
  const collector = new ReportCollector(); // 🔥 pro Run neu
  const files = collectMarkdownFiles(inputPath);

  if (!files.length) {
    console.warn("⚠️ No markdown scenarios found");
    return;
  }

  for (const file of files) {
    const scenarios = parseMarkdownScenarios(file);

    const selected = scenarios.filter(s =>
      matchesTagFilter(s.tags, opts.includeTags, opts.excludeTags)
    );

    if (scenarios.length > 0) {
      console.log(`🎯 ${selected.length}/${scenarios.length} scenarios selected`);
    }

    if (selected.length === 0) {
      continue;
    }

    // 🔹 Feature starten
    const featureName = path.basename(file, ".md");

    collector.startFeature(featureName, file, []);

    for (const scenario of selected) {
      collector.startScenario(scenario.name, scenario.tags);

      const world = new CustomWorld();
      await world.beforeAll();

      const runner = new StepRunner(world, collector);
      await runner.run(scenario.steps);

      await world.afterAll();

      collector.finishScenario();
    }

    collector.finishFeature();
  }

  collector.finishRun();

  // 🔹 Export jetzt EINMAL am Ende
  const run = collector.getRun();
  console.log("📄 Cucumber report written to cucumber-report.json");

  return collector.getRun();
}

function collectMarkdownFiles(p: string): string[] {
  const stat = fs.statSync(p);

  if (stat.isFile() && p.endsWith(".md")) {
    return [p];
  }

  if (stat.isDirectory()) {
    return fs.readdirSync(p).flatMap(entry => collectMarkdownFiles(path.join(p, entry)));
  }

  return [];
}
