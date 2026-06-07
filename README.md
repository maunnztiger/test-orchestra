# 🎭 TestOrchestra

**Markdown-first test automation for modern software teams.**

TestOrchestra is an open-source testing platform that combines executable specifications, automated test execution, reporting and documentation into a single workflow.

Write scenarios in Markdown.

Execute them automatically.

Publish results to Xray.

Synchronize documentation to Confluence.

All from a single source of truth.

---

## 🚀 Why TestOrchestra?

Many organizations maintain the same information multiple times:

- Requirements in Confluence
- Test cases in Xray
- Automation code in Git
- Results in CI/CD systems

Over time these artifacts drift apart.

TestOrchestra aims to reduce this duplication by treating Markdown scenarios as executable specifications.

A single scenario can become:

- Documentation
- Automated tests
- Xray test executions
- Confluence pages

without rewriting the same information multiple times.

---

## ✨ Features

### Markdown-Based Scenarios

Write test cases in a readable format:

```markdown
## Szenario: Login funktioniert

**GEGEBEN** der Benutzer öffnet die Login-Seite

**WENN** er sich anmeldet

**DANN** wird die Produktseite angezeigt
```

### Test Execution

Execute scenarios through the TestOrchestra runtime and Playwright integration.

### JUnit Reporting

Generate JUnit XML reports for CI/CD pipelines and external integrations.

### Xray Integration

Automatically upload test results to Xray Cloud.

Features include:

- automatic Test Execution creation
- Nightly Run reporting
- build-based execution history
- Jira integration

### Confluence Synchronisation

Publish Markdown scenarios directly to Confluence.

Documentation becomes part of the delivery pipeline.

### GitHub Actions Support

Run tests automatically:

```text
Commit
 ↓
GitHub Actions
 ↓
TestOrchestra
 ↓
JUnit
 ↓
Xray
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
 ┌──────┼──────┐
 ▼      ▼      ▼
Tests  Xray  Confluence
        │
        ▼
 Monitoring
```

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

TestOrchestra is an open-source project built to explore new approaches to test architecture, quality engineering and executable documentation.

The goal is not only to automate tests, but to create systems that make quality visible, reproducible and understandable.

---

## 🔭 Vision

See `VISION.md` for the long-term philosophy and roadmap behind the project.
