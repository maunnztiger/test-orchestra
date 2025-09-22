import fs from "fs";
import path from "path";
import chalk from "chalk";

export function printReport(jsonPath: string) {
  if (!fs.existsSync(jsonPath)) {
    console.error(chalk.red(`❌ Report nicht gefunden: ${jsonPath}`));
    return;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  console.log("\n📊 Test Report");
  console.log("=".repeat(60));

  for (const feature of data) {
    console.log(chalk.bold.cyan(`\nFeature: ${feature.name}`));

    for (const scenario of feature.elements) {
      console.log(chalk.bold(`  Szenario: ${scenario.name}`));

      for (const step of scenario.steps) {
        let symbol = "";
        let color = chalk.white;
        switch (step.result.status) {
          case "passed":
            symbol = "✅";
            color = chalk.green;
            break;
          case "failed":
            symbol = "❌";
            color = chalk.red;
            break;
          case "undefined":
            symbol = "⚠️";
            color = chalk.yellow;
            break;
        }

        console.log(
          "   " +
            symbol +
            " " +
            color(`${step.keyword}${step.name}`) +
            chalk.gray(
              ` (${(step.result.duration / 1_000_000).toFixed(0)}ms)`
            )
        );

        if (step.result.status === "failed" && step.result.error_message) {
          console.log(chalk.red("      → Fehler: " + step.result.error_message));
        }
      }
    }
  }

  console.log("\n" + "=".repeat(60));
}
