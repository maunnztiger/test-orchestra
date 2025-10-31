import { runScenario } from "./runner";

(async () => {
  const file = process.argv[2];
  if (!file) {
    console.error("❌ Kein Szenario angegeben.\n👉 Beispiel: npm run dev -- scenarios/login.md");
    process.exit(1);
  }

  await runScenario(file);
})();
