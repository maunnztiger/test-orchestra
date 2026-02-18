import fs from "fs";
import path from "path";
import { parseMarkdownScenarios } from "./core/markdownparser";
import { matchesTagFilter } from "./core/markdownparser";
import { StepRunner } from "./core/steprunner";
import { CustomWorld } from "./world/customworld";
import { ReportCollector } from "./reporting/reportCollector";
import { toCucumberJson } from "reporting/cucumberWriter";

const report = new ReportCollector();

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
    const scenarios = parseMarkdownScenarios(file);

    const selected = scenarios.filter(s =>
      matchesTagFilter(s.tags, opts.includeTags, opts.excludeTags)
    );

    if (scenarios.length > 0) {
        console.log(`🎯 ${selected.length}/${scenarios.length} scenarios selected`);
    }


    for (const scenario of selected) {
      report.startScenario(scenario.name, scenario.tags);

      const world = new CustomWorld();
      await world.beforeAll();

      const runner = new StepRunner(world, report);
      await runner.run(scenario.steps);

      await world.afterAll();
      report.endScenario();

      const feaure = report.buildFeature(file);
      const cucumberJson = toCucumberJson(feaure);
      fs.writeFileSync("cucumber-report.json", JSON.stringify(cucumberJson, null, 2));
    }
  }
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
