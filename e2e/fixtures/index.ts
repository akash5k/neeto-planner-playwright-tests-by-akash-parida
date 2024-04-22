//fixtures/index.ts

import {test as base} from "@playwright/test"
import LoginPage from "../poms/login"

interface ExtendFixtures {
    loginPage : LoginPage;
}

export const test = base.extend<ExtendFixtures>({
    loginPage: async ({page},use) =>{
        const loginPage = new LoginPage(page);
        await use(loginPage);
    }
})