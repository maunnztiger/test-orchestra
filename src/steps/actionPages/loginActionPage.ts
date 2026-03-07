import { Page, expect } from "@playwright/test";
import { HelperBase } from "@steps/pages/HelperBase";
import * as dotenv from "dotenv";

dotenv.config();

export class LoginActionPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async submitLogin() {
    await this.page.click("#login-button");
  }

  async verifyLoginSuccess() {
    const productTitle = this.page.locator(".title");
    await this.waitForAppearance(productTitle, 5000);
  }
  async verifyProductPageTitle(expectedTitle: string) {
    const productTitle = this.page.locator(".title");
    await this.checkTextContent(productTitle, expectedTitle);
  }
}
