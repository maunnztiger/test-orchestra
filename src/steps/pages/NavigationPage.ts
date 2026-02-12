import { HelperBase } from "./HelperBase";
import { Page } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();
export class NavigationPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async sauceLabsStartPage() {
    const url = process.env.APP_URL;
    await this.page.goto(url!);
  }
}
