import { runScenario } from "./runner.js";

const file = process.argv[2];
await runScenario(file);
