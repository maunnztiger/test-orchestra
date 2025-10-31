import { chromium, Browser, BrowserContext, Page } from "@playwright/test";

type HookFn = (world: CustomWorld) => Promise<void>;

export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  private static beforeAllHooks: HookFn[] = [];
  private static afterAllHooks: HookFn[] = [];

  // === Hook-Registrierung (global) ===
  static registerBeforeAll(fn: HookFn) {
    CustomWorld.beforeAllHooks.push(fn);
  }

  static registerAfterAll(fn: HookFn) {
    CustomWorld.afterAllHooks.push(fn);
  }

  // === Lifecycle ===
  async beforeAll() {
    console.log("🚀 Starte Browser und Test-Context");
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    // → Alle global registrierten BeforeAll-Hooks ausführen
    for (const fn of CustomWorld.beforeAllHooks) {
      await fn(this);
    }
  }

  async afterAll() {
    // → Erst Hooks ausführen
    for (const fn of CustomWorld.afterAllHooks) {
      await fn(this);
    }

    console.log("🧹 Browser wird geschlossen");
    await this.context?.close();
    await this.browser?.close();
  }
}

CustomWorld.registerBeforeAll(async world => {
  console.log("⚙️ [Hook] BeforeAll läuft");
});

CustomWorld.registerAfterAll(async world => {
  console.log("⚙️ [Hook] AfterAll läuft");
});
