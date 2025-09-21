import { Browser, Page, chromium } from "playwright";

export class World {
  data: Record<string, any> = {};
  browser!: Browser;
  page!: Page;

  async initBrowser() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  set(key: string, value: any) {
    this.data[key] = value;
  }

  get<T>(key: string): T {
    return this.data[key];
  }
}

export const world = new World();
export type WorldType = World;
