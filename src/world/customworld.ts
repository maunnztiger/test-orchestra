import { chromium, type Browser, type BrowserContext, type Page } from "@playwright/test";

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
    if (!this.page) {
      throw new Error("Page is not initialized yet. Cannot create PageManager.");
    }

    this._pm ??= new PageManager(this.page);
    return this._pm;
  }

  resetPageManager(): void {
    this._pm = undefined;
  }

  static registerBeforeAll(fn: HookFn): void {
    CustomWorld.beforeAllHooks.push(fn);
  }

  static registerAfterAll(fn: HookFn): void {
    CustomWorld.afterAllHooks.push(fn);
  }

  static registerBefore(fn: HookFn): void {
    CustomWorld.beforeHooks.push(fn);
  }

  static registerAfter(fn: HookFn): void {
    CustomWorld.afterHooks.push(fn);
  }

  async beforeAll(): Promise<void> {
    const isLinux = process.platform === "linux";

    this.browser = await chromium.launch({
      headless: process.env.CI === "true",
      slowMo: process.env.CI === "true" ? 0 : 500,
      args: isLinux ? ["--ozone-platform=x11", "--disable-gpu", "--disable-gpu-compositing"] : []
    });
    for (const fn of CustomWorld.beforeAllHooks) {
      await fn.call(this);
    }
  }

  async beforeScenario(this: CustomWorld) {
    console.log("🔥 beforeScenario wird ausgeführt");

    this.context = await this.browser.newContext();
    console.log("✅ BrowserContext erstellt");

    this.page = await this.context.newPage();
    console.log("✅ Page erstellt");

    this.resetPageManager();

    for (const fn of CustomWorld.beforeHooks) {
      await fn.call(this);
    }
  }

  async afterScenario(): Promise<void> {
    for (const fn of CustomWorld.afterHooks) {
      await fn.call(this);
    }

    // Hier nur den Szenario-Context schließen
    await this.context?.close();
    this.resetPageManager();
  }

  async afterAll(): Promise<void> {
    for (const fn of CustomWorld.afterAllHooks) {
      await fn.call(this);
    }

    // Browser erst nach dem gesamten Testlauf schließen
    await this.browser?.close();
  }
}

CustomWorld.registerBeforeAll(async function () {});
CustomWorld.registerAfterAll(async function () {});
