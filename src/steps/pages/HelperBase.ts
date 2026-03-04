import { expect, Locator, Page } from "@playwright/test";
import { loadTestData } from "@steps/utils/utils";

export class HelperBase {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected testData = loadTestData();
  async waitForNumberOfSeconds(seconds: number) {
    await this.page.waitForTimeout(seconds);
  }

  async loginAsGeneralUser(): Promise<void> {
    await this.page.fill("#user-name", process.env.STANDARD_USER!);
    await this.page.fill("#password", process.env.PASSWORD!);
   }

  async waitForAppearance(selector: Locator, timeout: number = 5000): Promise<void> {
    await expect(selector).toBeVisible({ timeout: timeout });
  }

  async waitForDisappearance(selector: Locator, timeout: number = 5000): Promise<void> {
    await expect(selector).toBeHidden({ timeout: timeout });
  }

  async checkTextContent(selector: Locator, expectedText: string): Promise<void> {
    await expect(selector).toHaveText(expectedText);
  }

  async checkTableElementsAllTextContents(table: Locator, expectedData: string[][]): Promise<void> {
    const rows = table.locator("tr");
    await expect(rows).toHaveCount(expectedData.length);

    for (let i = 0; i < expectedData.length; i++) {
      const cells = rows.nth(i).locator("th, td");
      await expect(cells).toHaveCount(expectedData[i].length);

      const actualTexts = await cells.allInnerTexts();
      const trimmed = actualTexts.map(t => t.trim());

      expect(trimmed).toEqual(expectedData[i]);
    }
  }

  async clickAndWaitForPost(clickTarget: Locator, url: string) {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        res => res.url().includes(url) && res.request().method() === "POST" && res.status() === 200,
        { timeout: 5000 }
      ),
      clickTarget.click()
    ]);

    return response;
  }

  async clickAndWaitForGet({ clickTarget, url }: { clickTarget: Locator; url: string }) {
    const [response] = await Promise.all([
      this.page.waitForResponse(
        res => res.url().includes(url) && res.request().method() === "GET" && res.status() === 200,
        { timeout: 5000 }
      ),
      clickTarget.click()
    ]);

    return response;
  }
}
