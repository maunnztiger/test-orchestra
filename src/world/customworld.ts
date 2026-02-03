import { chromium, Browser, BrowserContext, Page } from "@playwright/test";
import { PageManager } from "../steps/pages/PageManager";
type HookFn = (world: CustomWorld) => Promise<void>;

export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  private static beforeAllHooks: HookFn[] = [];
  private static afterAllHooks: HookFn[] = [];
  private _pm?: PageManager;
  
  get pm(): PageManager {
    if (!this._pm) {
      if(!this.page)  {
        throw new Error("Page is not initialized yet. Cannot create PageManager.");
      }
      this._pm = new PageManager(this.page);
    }
    return this._pm;
  }

  resetPageManager() {
    this._pm = undefined;
  }

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
    this.resetPageManager();
  
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
    this.resetPageManager();
  }
}

CustomWorld.registerBeforeAll(async world => {
  console.log("⚙️ [Hook] BeforeAll läuft");
});

CustomWorld.registerAfterAll(async world => {
  console.log("⚙️ [Hook] AfterAll läuft");
});
