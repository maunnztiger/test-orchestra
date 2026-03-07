import { Page, expect } from "@playwright/test";
import { HelperBase } from "@steps/pages/HelperBase";
import * as dotenv from "dotenv";

dotenv.config();

export class FiltersActionPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }
}
