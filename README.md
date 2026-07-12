# 🎭 TestOrchestra

**Behavior-Driven Testing for modern software teams.**

TestOrchestra is an open-source testing framework that combines automated test execution, reporting and documentation into a single workflow.

Write executable test scenarios in Markdown.

Run them with Playwright.

Publish results to Xray.

Synchronize validated behavior to Confluence.

All through a clean and extensible architecture.

---

## 🚀 Why TestOrchestra?

Software teams often struggle with uncertainty.

Questions like:

- Which behavior is already covered by automated tests?
- Which functionality has been validated?
- What exactly failed during a regression run?
- How can developers, testers and product owners understand existing test coverage?

are often difficult to answer.

TestOrchestra helps make automated testing visible and transparent.

It enables teams to document validated behavior, execute tests automatically and provide clear reporting across the entire delivery pipeline.

---

## ✨ Core Features

### Markdown-Based Test Scenarios

Describe automated test scenarios in a readable Markdown format.

```markdown
## Szenario: Login funktioniert

**GEGEBEN** der Benutzer öffnet die Login-Seite

**WENN** er sich anmeldet

**DANN** wird die Produktseite angezeigt
```

The same scenario can be used for:

- automated execution
- documentation
- reporting
- knowledge sharing

---

### Playwright Integration

Execute browser-based UI tests using Playwright.

TestOrchestra provides the orchestration layer while Playwright performs the actual browser automation.

---

### XRAY Reporting

Publish automated test results directly to Xray Cloud.

Features include:

- automatic Test Execution creation
- test step reporting
- build history
- Jira integration
- CI/CD support

---

### Confluence Synchronisation

Synchronize validated test scenarios directly to Confluence.

This helps teams understand:

- what has already been automated
- which behavior is covered
- how systems are currently validated

without manually maintaining additional documentation.

---

### CI/CD Integration

Integrate TestOrchestra into existing delivery pipelines.

```text
Commit
 ↓
GitHub Actions
 ↓
TestOrchestra
 ↓
XRAY
 ↓
Confluence
```

---

## 🏗 Architecture

```text
Markdown Scenarios
        │
        ▼
   TestOrchestra
        │
 ┌──────┼─────────────┐
 ▼      ▼             ▼
Tests  Reporting   Documentation
        │
        ▼
      XRAY
```

Test execution, reporting and documentation are intentionally separated.

This reduces coupling and allows integrations to evolve independently.

---

## 🎯 Design Principles

TestOrchestra is built around a few core ideas:

- Human-readable test scenarios
- Clear separation of execution and reporting
- Extensible adapter architecture
- CI/CD first
- Open standards
- Transparency of validated behavior

The framework is intentionally focused on testing and quality engineering rather than enforcing a specific development process.

---

## ⚡ Local Development

### Install dependencies

```bash
npm install
```

### Start PostgreSQL

```bash
docker compose up -d
```

### Configure environment

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test-orchestra
```

### Run TestOrchestra

```bash
npm run testorchestra
```

### Run tests

```bash
npm test
```

### Format code

```bash
npm run format
```

---

## 🌍 Open Source

TestOrchestra is an open-source project focused on test automation, quality engineering and transparent reporting.

The goal is not only to automate tests, but to make software quality visible, understandable and reproducible.

---

## 🔭 Roadmap

Current focus areas include:

- improved reporting adapters
- XRAY integrations
- Confluence synchronisation
- CI/CD workflows
- quality engineering tooling
- documentation of validated system behavior

See `VISION.md` for long-term ideas and project philosophy.

### Zur Implementierung auf deiner persönlichen Plattform schaue in docs/, um wichtige Hinweise zu entdecken,

### die euch Stunden der Fehlersuche ersparen

