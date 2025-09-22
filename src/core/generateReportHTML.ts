import fs from "fs";
import path from "path";

export function generateHtmlReport(reportFilePath: string) {
  const report = JSON.parse(fs.readFileSync(reportFilePath, "utf-8"));

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Test-Orchestra Report</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
    h1 { text-align: center; }
    .toolbar { text-align: center; margin-bottom: 20px; }
    button { margin: 0 5px; padding: 6px 12px; border: none; border-radius: 8px; background: #e0e0e0; cursor: pointer; }
    button.active { background: #007bff; color: white; }
    .scenario { background: white; margin: 20px auto; max-width: 900px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 20px; }
    .scenario h2 { margin-top: 0; cursor: pointer; }
    .steps { display: block; margin-top: 10px; }
    .step { display: flex; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid #eee; }
    .step:last-child { border-bottom: none; }
    .status { font-weight: bold; padding: 2px 6px; border-radius: 6px; }
    .passed { color: #2e7d32; }
    .failed { color: #c62828; }
    .undefined { color: #ff8f00; }
    .error { color: #c62828; font-size: 0.9em; margin-top: 5px; }
    .screenshot { display: block; margin-top: 5px; max-width: 400px; border: 1px solid #ccc; border-radius: 8px; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <h1>Test-Orchestra Report</h1>

  <div class="toolbar">
    <button data-filter="all" class="active">Alle</button>
    <button data-filter="passed">✅ Passed</button>
    <button data-filter="failed">❌ Failed</button>
    <button data-filter="undefined">⚠️ Undefined</button>
  </div>

  ${report.map((scenario: any, i: number) => `
    <div class="scenario">
      <h2 onclick="toggleSteps(${i})">📂 ${scenario.scenario}</h2>
      <div class="steps" id="steps-${i}">
        ${scenario.steps.map((step: any) => `
          <div class="step" data-status="${step.status}">
            <div>
              ${step.text}
              ${step.error ? `<div class="error">❌ ${step.error}</div>` : ""}
              ${step.screenshot ? `<img src="${path.basename(step.screenshot)}" class="screenshot"/>` : ""}
            </div>
            <span class="status ${step.status}">${step.status.toUpperCase()}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("")}

  <script>
    function toggleSteps(index) {
      document.getElementById("steps-" + index).classList.toggle("hidden");
    }
    document.querySelectorAll("button[data-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("button[data-filter]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        document.querySelectorAll(".step").forEach(step => {
          if (filter === "all") step.style.display = "";
          else step.style.display = step.dataset.status === filter ? "" : "none";
        });
      });
    });
  </script>
</body>
</html>
`;

  const outFile = path.join(path.dirname(reportFilePath), "report.html");
  fs.writeFileSync(outFile, html, "utf-8");
  console.log(`📄 HTML-Report gespeichert: ${outFile}`);
}
