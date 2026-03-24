import { Page } from "@playwright/test";
import { HelperBase } from "@steps/pages/HelperBase";
import * as dotenv from "dotenv";
dotenv.config();

export class FiltersActionPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async verifyProductPageHeader(headerName: string) {
    const header = this.page.locator(".app_logo");
    await this.waitForAppearance(header, 5000);
    await this.checkTextContent(header, headerName);
  }

  async clickFiltersymbol() {
    const filterSymbol = this.page.locator(".select_container");
    await filterSymbol.click();
  }

  async validateFilterMenu() {
    const menuFirstSelect = this.page.locator(".product_sort_container");
    await this.waitForAppearance(menuFirstSelect, 5000);
  }
}
