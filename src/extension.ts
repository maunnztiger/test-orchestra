import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

let diagnosticCollection: vscode.DiagnosticCollection;

/**
 * Extrahiere Steps aus Markdown (erkennt Zeilen wie: **Given** ich mache X  oder Given ich mache X)
 */
function extractStepsFromMarkdown(text: string): { line: number; text: string }[] {
  const lines = text.split(/\r?\n/);
  const result: { line: number; text: string }[] = [];
  const stepLineRegex = /^(?:\s*\*\*?)?\s*(?:Given|When|Then|And|But|Gegeben|Wenn|Dann|Und)\b\s*(.*)$/i;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const m = raw.match(stepLineRegex);
    if (m && m[1] && m[1].trim().length > 0) {
      // Entferne ggf. Markdown-Fett-Markup übrig (z. B. **Given** ...)
      const cleaned = m[1].replace(/\*\*/g, "").trim();
      result.push({ line: i, text: cleaned });
    }
  }
  return result;
}

/**
 * Liest rekursiv Step-Definition-Dateien und extrahiert pattern-Strings
 * Unterstützt patterns in " ' ` quotes: Given("..."), given('...'), When(`...`, ...)
 */
function loadStepPatterns(workspaceRoot: string, relativeStepsPath: string): RegExp[] {
  const root = path.join(workspaceRoot, relativeStepsPath);
  if (!fs.existsSync(root)) return [];

  const patterns: RegExp[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (e.isFile() && (e.name.endsWith(".ts") || e.name.endsWith(".js"))) {
        const content = fs.readFileSync(full, "utf8");

        // Regex: Given("pattern", ...), given('pattern', ...), etc. (captures quoted text)
        const callRegex = /(?:\bGiven|\bgiven|\bWhen|\bwhen|\bThen|\bthen|\bAnd|\band|\bBut|\bbut)\s*\(\s*(['"`])([\s\S]*?)\1\s*,/g;
        let m: RegExpExecArray | null;
        while ((m = callRegex.exec(content)) !== null) {
          const rawPattern = m[2];
          // Parameterplatzhalter {param} -> match minimal chars
          const safe = rawPattern.replace(/\{(\w+)\}/g, "(.+?)");
          try {
            // Unicode + case-insensitive
            const re = new RegExp("^" + safe + "$", "iu");
            patterns.push(re);
          } catch (err) {
            // Ungültige regex -> ignorieren (z.B. dynamische patterns)
            // optional: console.warn
          }
        }
      }
    }
  }

  walk(root);
  return patterns;
}

/**
 * Prüft ein Markdown-Dokument und erzeugt Diagnostics für Steps ohne Match
 */
function validateDocument(doc: vscode.TextDocument) {
  diagnosticCollection.clear();

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) return;

  const wsRoot = workspaceFolders[0].uri.fsPath;
  const stepsPath = vscode.workspace.getConfiguration("testOrchestra").get<string>("stepDefinitionsPath") || "src/step-definitions";

  const stepPatterns = loadStepPatterns(wsRoot, stepsPath);

  const stepsInDoc = extractStepsFromMarkdown(doc.getText());

  const diagnostics: vscode.Diagnostic[] = [];

  for (const s of stepsInDoc) {
    const normalized = s.text.replace(/\u00A0/g, " ").trim();
    const matched = stepPatterns.some(p => {
      try {
        return p.test(normalized);
      } catch {
        return false;
      }
    });

    if (!matched) {
      const line = doc.lineAt(s.line);
      const range = line.range;
      const diag = new vscode.Diagnostic(range, `Step noch nicht implementiert: "${s.text}"`, vscode.DiagnosticSeverity.Warning);
      diag.source = "test-orchestra";
      diag.code = "TO001";
      diagnostics.push(diag);
    }
  }

  diagnosticCollection.set(doc.uri, diagnostics);
}

/**
 * Validate all open markdown docs (useful when step-defs changed)
 */
function validateAllOpenMarkdownDocs() {
  for (const doc of vscode.workspace.textDocuments) {
    if (doc.languageId === "markdown") {
      validateDocument(doc);
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection("test-orchestra");
  context.subscriptions.push(diagnosticCollection);

  // validate currently open markdown docs
  validateAllOpenMarkdownDocs();

  // Events
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => {
      if (doc.languageId === "markdown") validateDocument(doc);
    }),
    vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.languageId === "markdown") validateDocument(e.document);
    }),
    vscode.workspace.onDidSaveTextDocument(doc => {
      // If you save step-definitions, re-lint everything
      if (doc.languageId === "typescript" || doc.languageId === "javascript") {
        validateAllOpenMarkdownDocs();
      }
    }),
    vscode.commands.registerCommand("testOrchestra.relintWorkspace", () => {
      validateAllOpenMarkdownDocs();
      vscode.window.showInformationMessage("Test-Orchestra: Re-Linted open markdown files.");
    })
  );

  // Watch for changes in the step-definitions folder (so linter updates when defs change)
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const wsRoot = workspaceFolders[0].uri.fsPath;
    const stepsPathCfg = vscode.workspace.getConfiguration("testOrchestra").get<string>("stepDefinitionsPath") || "src/step-definitions";
    const pattern = new vscode.RelativePattern(wsRoot, path.posix.join(stepsPathCfg, "**", "*.{ts,js}"));
    const watcher = vscode.workspace.createFileSystemWatcher(pattern, false, false, false);
    context.subscriptions.push(
      watcher.onDidCreate(() => validateAllOpenMarkdownDocs()),
      watcher.onDidChange(() => validateAllOpenMarkdownDocs()),
      watcher.onDidDelete(() => validateAllOpenMarkdownDocs())
    );
  }
}

export function deactivate() {
  if (diagnosticCollection) diagnosticCollection.dispose();
}
