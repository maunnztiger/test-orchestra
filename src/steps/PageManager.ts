import {Page} from '@playwright/test'
import {LoginActionPage } from './loginActionPage'

export class PageManager {
    private readonly page:Page
    private readonly loginAction : LoginActionPage

    
    constructor(page: Page) {
       this.page = page 
       this.loginAction = new LoginActionPage(this.page)
    }
    


    makeloginAction() {
        return this.loginAction
    }
}