# WSL2 / Ubuntu Installation

This guide describes how to set up **TestOrchestra** inside a fresh Ubuntu WSL2 environment.

---

## Requirements

- Ubuntu 24.04 / 26.04 (WSL2)
- Node.js 22+
- npm
- Git

---

## Clone the repository

```bash
git clone git@github.com:maunnztiger/test-orchestra.git
cd test-orchestra
```

---

## Install dependencies

```bash
npm install
```

---

## Install Playwright

```bash
npx playwright install
```

If Playwright reports that Chromium is not supported on your Ubuntu version, install the browser using your package manager instead or use the Playwright version that supports your distribution.

---

## Create the environment file

Create a `.env` file in the project root.

Example:

```env
APP_URL=https://www.saucedemo.com/
USER_NAME=standard_user
USER_PASSWD=secret_sauce

CI=false
```

---

## Running the tests

Example:

```bash
npm run login
```

---

# WSLg Chromium workaround

On some Ubuntu WSL2 installations Chromium starts successfully but only displays an invisible or empty window.

If this happens, launch Chromium with the following arguments:

```ts
chromium.launch({
  headless: false,
  slowMo: 500,
  args: ["--ozone-platform=x11", "--disable-gpu", "--disable-gpu-compositing"]
});
```

This forces Chromium to use X11 software rendering instead of GPU acceleration.

Firefox is not affected by this issue.

---

## VS Code

Install the VS Code **WSL** extension.

Open the project directly from WSL:

```bash
code .
```

---

## Verify the installation

Run

```bash
npm run login
```

A Chromium browser should open, execute the scenario and close automatically.

If all steps pass, the installation is complete.
