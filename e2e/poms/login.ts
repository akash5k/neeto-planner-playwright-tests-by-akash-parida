// poms/login.ts

import { Page, expect } from "@playwright/test";

export default class LoginPage {
    page: Page;
    constructor(page: Page){
        this.page =page;
    }

    loginAndVerify = async ({email,loginCode}:{email:string,loginCode:string}):Promise<void>=>{
        await this.page.getByTestId('neeto-auth-email-input-field').fill(email)
        await this.page.getByTestId('neeto-auth-login-button').click();        
        await this.page.getByPlaceholder('Enter 6 digit login code').fill(loginCode);
        //verify if logged in successful
        await expect(this.page.getByTestId('main-header')).toBeVisible(({
            timeout:50000,
        }))
    }
}