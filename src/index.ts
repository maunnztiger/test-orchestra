#!/usr/bin/env node
import { Command } from "commander";
import { runScenariosFromPath } from "runner";
import { loadStepDefinitions } from "@core/loadStepDefinitions";
import { createExporter } from "reporting/exporterFactory";

loadStepDefinitions();
const program = new Command();

program.name("testorchestra").description("BDD-style test runner").version("0.1.0");

program
  .command("run")
  .argument("<path>", "markdown file or directory")
  .option("--tags <tags>", "include tags (comma separated)")
  .option("--exclude <tags>", "exclude tags (comma separated)")
  .option("--report <type>", "report type (json|db)", "json")
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

    const exporter = createExporter(options.report, {dbURL: process.env.DB_URL});
    await exporter.export(run);

  });

program.parseAsync(process.argv);
