import { Page, test, expect } from "@playwright/test";
import { HelperBase } from "./HelperBase";

export class LoginActionPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }
}
