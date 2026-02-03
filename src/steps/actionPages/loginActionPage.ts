import { Page, expect } from "@playwright/test";
import { HelperBase } from "@steps/pages/HelperBase";
import * as dotenv from "dotenv";
import { loadTestData } from "@steps/utils/utils";

dotenv.config();

export class LoginActionPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    const usernameField = this.page.locator("#user-name");
    const passwordField = this.page.locator("#password");
    const usernameValue = username || process.env.STANDARD_USER || loadTestData().standard_user;
    const passwordValue = password || process.env.PASSWORD || loadTestData().password;
    await usernameField.fill(usernameValue);
    await passwordField.fill(passwordValue);
  }

  async submitLogin() {
    await this.page.click("#login-button");
  }

  async verifyLoginSuccess() {
    await expect(this.page.locator(".inventory_list")).toBeVisible();
  }
}