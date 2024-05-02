import { faker } from "@faker-js/faker"
import { test } from "../fixtures"
import { STORAGE_STATE } from "../../playwright.config";

import { TEST_DATA } from "../constants/testData";

test.describe("Login page", () => {
    let loginCode: string;
    test.beforeEach(() => {
        loginCode = faker.string.numeric(6);
    })
    test("should login with the correct credentials", async ({ page, loginPage }) => {

        await test.step("Step 1 : Navigate to base url", () => page.goto("/"))

        await test.step("Step 2 : Login to the application", () => loginPage.loginAndVerify({ email: TEST_DATA.email, loginCode: loginCode }))

        await test.step("Step 3 : Store the session", () => page.context().storageState({ path: STORAGE_STATE }))
    })
})

