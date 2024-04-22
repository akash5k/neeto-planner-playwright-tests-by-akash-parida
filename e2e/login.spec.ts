//login.spec.ts

import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test"

test.describe("Login Page", () => {
    let loginCode: string;
    test.beforeEach(() => {
        loginCode = faker.random.numeric(6);
    })
    test("Should login the user correctly", async ({ page }) => {
        await page.goto("https://akash-parida-iiit-bh.neetoplanner.net/");
        await page.locator('[data-test-id="neeto-auth-email-input-field"]').fill("cpts9gnqty9-planner-akash_parida-iiit_bh@bigbinary.com");
        await page.locator('[data-test-id="neeto-auth-login-button"]').click();
        await page.getByPlaceholder('Enter 6 digit login code').fill(loginCode);
        await expect(page.locator('.neeto-molecules-sidebar__logo')).toBeVisible(({
            timeout: 300000,
        }));
    })
})