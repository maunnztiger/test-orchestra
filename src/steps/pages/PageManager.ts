import {Page} from '@playwright/test'
import {LoginActionPage } from './loginActionPage'
import { NavigationPage } from './NavigationPage'

export class PageManager {
    private readonly page:Page
    private readonly loginAction : LoginActionPage
    private readonly navigationAction : NavigationPage

    
    constructor(page: Page) {
       this.page = page 
       this.loginAction = new LoginActionPage(this.page)
       this.navigationAction = new NavigationPage(this.page)
    }
    
    navigateTo() {
        return this.navigationAction
    }

    makeloginAction() {
        return this.loginAction
    }
}