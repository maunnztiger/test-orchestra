#!/usr/bin/env node
import { Command } from "commander";
import { runScenariosFromPath } from "runner";
import { loadStepDefinitions } from "@core/loadStepDefinitions";
import { CucumberJsonExporter } from "reporting/cucumberExporter";
import * as fs from 'fs'

loadStepDefinitions();
const program = new Command();

program.name("testorchestra").description("BDD-style test runner").version("0.1.0");

program
  .command("run")
  .argument("<path>", "markdown file or directory")
  .option("--tags <tags>", "include tags (comma separated)")
  .option("--exclude <tags>", "exclude tags (comma separated)")
  .action(async (inputPath, options) => {
    const includeTags = options.tags ? options.tags.split(",").map((t: string) => t.trim()) : [];

    const excludeTags = options.exclude
      ? options.exclude.split(",").map((t: string) => t.trim())
      : [];

    const run = await runScenariosFromPath(inputPath, {
      includeTags,
      excludeTags
    });
    if (!run) return;

    const exporter = new CucumberJsonExporter();
    const json = exporter.export(run);

    fs.writeFileSync(
    "cucumber-report.json",
    JSON.stringify(json, null, 2)
    );

console.log("📄 Cucumber report written to cucumber-report.json");
  });

program.parseAsync(process.argv);
