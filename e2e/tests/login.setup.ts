//login.spec.ts

// import {test ,expect} from "@playwright/test" 
import { Faker, faker } from "@faker-js/faker"
import {test} from "../fixtures"
import { STORAGE_STATE } from "../../playwright.config";


test.describe("Login page",()=>{
    let loginCode:string;
    test.beforeEach(()=>{
        loginCode = faker.string.numeric(6);
    })
    test("Should login the user and verify",async({page,loginPage})=>{
        await page.goto("https://akash-parida-iiit-bh.neetoplanner.net/");
        
        await loginPage.loginAndVerify({
            email: "cpts9gnqty9-planner-akash_parida-iiit_bh@bigbinary.com",
            loginCode : loginCode
        })
        await page.context().storageState({ path: STORAGE_STATE });
    })
})

