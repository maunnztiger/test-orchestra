import { HelperBase } from "./HelperBase";
import { Page } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();
export class NavigationPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async sauceLabsStartPage() {
    if (!this.page) {
      throw new Error("Page wurde nicht initialisiert");
    }

    await this.page.goto(process.env.APP_URL!);
  }
}
