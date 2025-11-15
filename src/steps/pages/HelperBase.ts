import { Page, test } from "@playwright/test";

export class HelperBase {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForNumberOfSeconds(seconds: number) {
    await this.page.waitForTimeout(seconds);
  }

  async loginAsGeneralUser() {}
}
