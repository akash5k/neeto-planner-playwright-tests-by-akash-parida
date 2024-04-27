//login.spec.ts

import { faker } from "@faker-js/faker"
import { test } from "../fixtures"
import { STORAGE_STATE } from "../../playwright.config";
import { BASE_URL, TEST_DATA } from "../constants/common";

test.describe("Login page", () => {
    let loginCode: string;
    test.beforeEach(() => {
        loginCode = faker.string.numeric(6);
    })
    test("should login with the correct credentials", async ({ page, loginPage }) => {
        await test.step("Step 1 : Navigate to base url", ()=>{
             page.goto(BASE_URL)
            })
        

        await test.step ("Step 2 : Login to the application",async()=>{
            await loginPage.loginAndVerify({
                email: TEST_DATA.email,
                loginCode: loginCode
            })
            await page.context().storageState({ path: STORAGE_STATE });
        })
    })
})

