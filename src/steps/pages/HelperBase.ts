import { expect, Locator, Page, test } from "@playwright/test";

export class HelperBase {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForNumberOfSeconds(seconds: number) {
    await this.page.waitForTimeout(seconds);
  }

  async loginAsGeneralUser() {}

  async waitForAppearanceOfElement(selector: Locator, timeout: number = 5000): Promise<void> {
    await expect(selector).toBeVisible({ timeout: timeout });
  }

  async waitForDisappearanceOfElement(selector: Locator, timeout: number = 5000): Promise<void> {
    await expect(selector).toBeHidden({ timeout: timeout });
  }

  async clickAndWaitForPost(clickTarget: Locator, url: string) {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        res => res.url().includes(url) && 
        res.request().method() === "POST" &&
        res.status() === 200,
        { timeout: 5000 }
      ),
      clickTarget.click()
    ]);

    return response;
  }

  async clickAndWaitForGet({ clickTarget, url }: { clickTarget: Locator; url: string; }) {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) => res.url().includes(url) &&
        res.request().method() === "GET" &&
        res.status() === 200,
        { timeout: 5000 }
      ),
      clickTarget.click()
    ]);

    return response;
  }
}
