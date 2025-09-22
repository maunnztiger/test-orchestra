import fs from "fs";
import path from "path";

export function generateLogsHtml(logFilePath: string) {
  const logs = fs.readFileSync(logFilePath, "utf-8").split("\n");

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Test-Orchestra Logs</title>
  <style>
    body { font-family: monospace; background: #1e1e1e; color: #dcdcdc; margin: 0; padding: 20px; }
    h1 { text-align: center; color: #fff; }
    .log { padding: 4px 0; border-bottom: 1px solid #333; }
    .error { color: #f28b82; }
    .success { color: #81c995; }
    .info { color: #8ab4f8; }
  </style>
</head>
<body>
  <h1>Test-Orchestra Logs</h1>
  <div>
    ${logs.map(l => {
      const cls = l.includes("❌") ? "error" : l.includes("✅") ? "success" : "info";
      return `<div class="log ${cls}">${l}</div>`;
    }).join("")}
  </div>
</body>
</html>
`;

  const outFile = path.join(path.dirname(logFilePath), "logs.html");
  fs.writeFileSync(outFile, html, "utf-8");
  console.log(`📄 Logs-HTML gespeichert: ${outFile}`);
}
