import { HelperBase } from "./HelperBase";
import { Page } from "@playwright/test";
import { loadConfigFile } from "@steps/utils/utils";

export class NavigationPage  extends HelperBase{
    
    constructor(page:Page) {
        super(page)
    }

    async sauceLabsStartPage() {
        const data = loadConfigFile()
        const url = data.SAUCE_LABS_BASE_URL;
        await this.page.goto(url)
    }
}