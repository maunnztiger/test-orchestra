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
    console.log("🌍 Aktuelle URL:", this.page.url());

console.log(
  "📄 Seitentitel:",
  await this.page.title()
);

console.log(
  "🔎 Logo vorhanden:",
  await this.page.locator(".app_logo").count()
);

console.log(
  "⚠️ Fehlermeldung:",
  await this.page.locator("[data-test='error']").allTextContents()
);
    
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
    await this.waitForNumberOfSeconds(5);
  }

  async verifyViceVersaElementsName(article: string) {
  const productNames = this.page.locator(
    ".inventory_item_name"
  );

  await expect(productNames.first()).toHaveText(article);
}

  async verifyViceVersaElementsLastName(article: string) {
  const productNames = this.page.locator(
    ".inventory_item_name"
  );

  await expect(productNames.last()).toHaveText(article);
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
  const productNames = this.page.locator(
    ".inventory_item_name"
  );

  await expect(productNames.first()).toHaveText(
    "Sauce Labs Backpack"
  );
}

  async verifyResetedElementsLastName() {
  const productNames = this.page.locator(
    ".inventory_item_name"
  );

  await expect(productNames.last()).toHaveText(
    "Test.allTheThings() T-Shirt (Red)"
  );
}
}
