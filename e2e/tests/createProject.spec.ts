import {test ,expect} from "@playwright/test"
import { faker } from "@faker-js/faker"

test.describe("Create task",()=>{
    let projectName:string;
    let projectDescription:string;
    test.beforeEach(()=>{
        projectName = faker.word.words({count:2});
        projectDescription = faker.word.words({count:10});
    })
    test("Should create a task and verify on project details page",async ({page})=>{
        await page.goto("/");
        await page.getByRole('button', { name: 'Add new project' }).click();
        await page.getByPlaceholder('Enter project name').fill(projectName);
        await page.getByPlaceholder('Enter description').fill(projectDescription);
        await page.getByRole('button', { name: 'Save changes' }).click();

        //verify project creation
        await expect(page.getByText(projectName)).toBeVisible();
        // await expect(page.getByTestId('neeto-molecules-header')).toContainText(projectName);

    })
})