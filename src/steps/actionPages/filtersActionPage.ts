import { expect, Page } from "@playwright/test";
import { HelperBase } from "@steps/pages/HelperBase";
import { error } from "console";
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
    try {
      const menuSelect = this.page.locator(".product_sort_container");
      await this.waitForAppearance(menuSelect, 5000);
      await expect(menuSelect).toContainText("Name (A to Z)");
    } catch (err) {
      console.error("Elemente sind nicht sichtbar", err);
    }
  }

  async clickFilterZ_A(filterName: string) {
    const menuSelect = this.page.locator(".product_sort_container");
    await expect(menuSelect).toContainText(filterName);
    await menuSelect.selectOption({ label: filterName });
    await this.waitForNumberOfSeconds(5);
  }
}
