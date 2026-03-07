import { Page } from "@playwright/test";
import { LoginActionPage } from "../actionPages/loginActionPage";
import { FiltersActionPage } from "@steps/actionPages/filtersActionPage";
import { NavigationPage } from "./NavigationPage";

export class PageManager {
  private readonly page: Page;
  private readonly loginAction: LoginActionPage;
  private readonly navigationAction: NavigationPage;
  private readonly filtersAction: FiltersActionPage;

  constructor(page: Page) {
    this.page = page;
    this.loginAction = new LoginActionPage(this.page);
    this.navigationAction = new NavigationPage(this.page);
    this.filtersAction = new FiltersActionPage(this.page);
  }

  navigateTo() {
    return this.navigationAction;
  }

  makeloginAction() {
    return this.loginAction;
  }

  makeFiltersAction() {
    return this.filtersAction;
  }
}
