import { Page, expect } from "@playwright/test";
import {  PLACEHOLDERS } from "../constants/texts/login";
import { BUTTON_SELECTORS } from "../constants/selectors/login";

export default class LoginPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    loginAndVerify = async ({ email, loginCode }: { email: string, loginCode: string }): Promise<void> => {       
        await this.page.getByPlaceholder(PLACEHOLDERS.emailInput).fill(email);
        await this.page.locator(BUTTON_SELECTORS.loginButton).click();
        await this.page.getByPlaceholder(PLACEHOLDERS.loginCode).fill(loginCode);
        await expect(this.page.getByTestId('sidebar')).toBeVisible({
            timeout: 10000
        })
    }
}