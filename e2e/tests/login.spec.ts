//login.spec.ts

import {test ,expect} from "@playwright/test" 
import { Faker, faker } from "@faker-js/faker"

test.describe("Login page",()=>{
    let loginCode:string;
    test.beforeEach(()=>{
        loginCode = faker.string.numeric(6);
    })
    test("Should login the user and verify",async({page})=>{
        await page.goto("https://akash-parida-iiit-bh.neetoplanner.net/");
        await page.getByTestId('neeto-auth-email-input-field').fill("cpts9gnqty9-planner-akash_parida-iiit_bh@bigbinary.com")
        await page.getByTestId('neeto-auth-login-button').click();        
        await page.getByPlaceholder('Enter 6 digit login code').fill(loginCode);
        //verify if logged in successful
        await expect(page.getByTestId('main-header')).toBeVisible(({
            timeout:50000,
        }))

    })
})

