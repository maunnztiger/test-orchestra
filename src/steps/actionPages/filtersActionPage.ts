import { Page, expect } from "@playwright/test";
import { HelperBase } from "@steps/pages/HelperBase";
import * as dotenv from "dotenv";
dotenv.config();

export class FiltersActionPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async verifyProductPageHeader(headerName: string){
    const header = this.page.locator('.app_logo');
    await this.waitForAppearance(header);
    await this.checkTextContent(header, headerName);

  }
}
