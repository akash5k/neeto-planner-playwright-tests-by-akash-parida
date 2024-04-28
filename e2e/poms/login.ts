import { Page, expect } from "@playwright/test";
import {TEXT_SELECTORS,INPUT_SELECTORS} from "../constants/texts/login";

export default class LoginPage {
    page: Page;
    constructor(page: Page){
        this.page =page;
    }

    loginAndVerify = async ({email,loginCode}:{email:string,loginCode:string}):Promise<void>=>{
        await this.page.getByTestId(INPUT_SELECTORS.emailInput).fill(email)
        await this.page.getByTestId(TEXT_SELECTORS.loginButton).click();        
        await this.page.getByPlaceholder(INPUT_SELECTORS.loginCode).fill(loginCode);
        //verify if logged in successful
        await expect(this.page.getByTestId(TEXT_SELECTORS.mainHeader)).toBeVisible(({
            timeout:50000,
        }))
    }
}