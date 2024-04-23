//login.spec.ts

import { Faker, faker } from "@faker-js/faker"
import { test } from "../fixtures"
import { STORAGE_STATE } from "../../playwright.config";

test.describe("Login page", () => {
    let loginCode: string;
    test.beforeEach(() => {
        loginCode = faker.string.numeric(6);
    })
    test("should login with the correct credentials", async ({ page, loginPage }) => {
        await test.step("Step 1 : Navigate to base url", async () => { 
            await page.goto("https://akash-parida-iiit-bh.neetoplanner.net/"); 
        })

        await test.step ("Step 2 : Login to the application",async()=>{
            await loginPage.loginAndVerify({
                email: "cpts9gnqty9-planner-akash_parida-iiit_bh@bigbinary.com",
                loginCode: loginCode
            })
            await page.context().storageState({ path: STORAGE_STATE });
        })
    })
})
