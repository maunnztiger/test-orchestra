import { chromium, Browser, BrowserContext, Page } from "@playwright/test";
import { PageManager } from "../steps/pages/PageManager";
type HookFn = (this: CustomWorld) => Promise<void>;

export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  private static beforeAllHooks: HookFn[] = [];
  private static afterAllHooks: HookFn[] = [];
  private static beforeHooks: HookFn[] = [];
  private static afterHooks: HookFn[] = [];
  private _pm?: PageManager;

  get pm(): PageManager {
    if (!this._pm) {
      if (!this.page) {
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

  static registerBefore(fn: HookFn) {
    CustomWorld.beforeHooks.push(fn);
  }

  static registerAfter(fn: HookFn) {
    CustomWorld.afterHooks.push(fn);
  }

  // === Lifecycle ===
  async beforeAll(this: CustomWorld) {
    // → Alle global registrierten BeforeAll-Hooks ausführen
    for (const fn of CustomWorld.beforeAllHooks) {
      await fn.call(this);
    }
    this.browser = await chromium.launch({ headless: false });
  }

  async beforeScenario(this: CustomWorld) {
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.resetPageManager();
    for (const fn of CustomWorld.beforeHooks) {
      await fn.call(this);
    }
  }
  async afterScenario(this: CustomWorld) {
    for (const fn of CustomWorld.afterHooks) {
      await fn.call(this);
    }
    await this.context?.close();
    await this.browser?.close();
    this.resetPageManager();
  }

  async afterAll() {
    // → Erst Hooks ausführen
    for (const fn of CustomWorld.afterAllHooks) {
      await fn.call(this);
    }
  }
}

CustomWorld.registerBeforeAll(async function () {});

CustomWorld.registerAfterAll(async function () {});
