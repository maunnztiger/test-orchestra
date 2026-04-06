import { TestRun } from "./domain";

export function printRunSummary(run: TestRun) {
  let featureCount = run.features.length;
  let scenarioCount = 0;
  let stepCount = 0;

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const feature of run.features) {
    scenarioCount += feature.scenarios.length;

    for (const scenario of feature.scenarios) {
      stepCount += scenario.steps.length;

      for (const step of scenario.steps) {
        if (step.status === "passed") passed++;
        if (step.status === "failed") failed++;
        if (step.status === "skipped") skipped++;
      }
    }
  }

  console.log("\n======================================");
  console.log("Test Run Summary");
  console.log("======================================\n");

  console.log(`Features:   ${featureCount}`);
  console.log(`Scenarios:  ${scenarioCount}`);
  console.log(`Steps:      ${stepCount}\n`);

  console.log(`Passed:     ${passed}`);
  console.log(`Failed:     ${failed}`);
  console.log(`Skipped:    ${skipped}\n`);
  console.log("\n--------------------------------------");
  console.log(`Duration:   ${run.durationMs} ms`);
  console.log("--------------------------------------");

  if (failed > 0) {
    console.log("\n======================================");
    console.log("❌ TEST RUN FAILED");
    console.log("\n======================================");
  } else {
    console.log("\n======================================");
    console.log("✅ ALL TESTS PASSED");
    console.log("======================================");
  }
}
