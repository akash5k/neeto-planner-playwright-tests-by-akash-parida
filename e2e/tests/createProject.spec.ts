import { test } from "../fixtures"
import { faker } from "@faker-js/faker"

test.describe("Create task", () => {
    let projectName: string;
    let projectDescription: string;
    test.beforeEach(() => {
        projectName = faker.word.words({ count: 2 });
        projectDescription = faker.word.words({ count: 10 });
    })
    test("Should create a task and verify on project details page", async ({
        page,
        projectPage }) => {
        await page.goto("/");
        await projectPage.addProject({ projectName, projectDescription });
    })
})