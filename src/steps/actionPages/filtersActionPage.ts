import { expect, Page } from "@playwright/test";
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
    const menuSelect = this.page.locator(".product_sort_container");
    await this.waitForAppearance(menuSelect, 5000);
  }

  async clickFilterZ_A(filterName: string) {
    const menuSelect = this.page.locator(".product_sort_container");
    await expect(menuSelect).toContainText(filterName);
    await menuSelect.selectOption({ label: filterName });
  }

  async verifyViceVersaElementsName(article: string) {
    await expect(
      this.page
        .getByRole("link", {
          name: article,
          exact: true
        })
        .last()
    ).toHaveText(article);
  }

  async verifyViceVersaElementsLastName(article: string) {
    await expect(
      this.page
        .getByRole("link", {
          name: article,
          exact: true
        })
        .last()
    ).toHaveText(article);
  }

  async clickFilterA_Z(filterName: string) {
    const menuSelect = this.page.locator(".product_sort_container");
    await expect(menuSelect).toContainText(filterName);
    await menuSelect.selectOption({ label: filterName });
  }

  async validateAlteredFilterMenu() {
    const menuSelect = this.page.locator(".product_sort_container");
    await this.waitForAppearance(menuSelect, 5000);
  }

  async verifyResetedElementsName() {
    await expect(
      this.page
        .getByRole("link", {
          name: "Sauce Labs Backpack",
          exact: true
        })
        .last()
    ).toHaveText("Sauce Labs Backpack");
  }

  async verifyResetedElementsLastName() {
    await expect(
      this.page
        .getByRole("link", {
          name: "Test.allTheThings() T-Shirt (Red)",
          exact: true
        })
        .last()
    ).toHaveText("Test.allTheThings() T-Shirt (Red)");
  }
}
