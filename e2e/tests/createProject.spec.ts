import { test } from "../fixtures"
import { faker } from "@faker-js/faker"

test.describe("Create project", () => {
    let projectName: string;
    let projectDescription: string;
    test.beforeEach(() => {
        projectName = faker.word.words({ count: 2 });
        projectDescription = faker.word.words({ count: 10 });
    })
    test("should create a task and verify on project details page", async ({
        page,
        projectPage }) => {
        await test.step("Step 1 : Navigate to base url", () => page.goto("/"))
        await test.step("Step 2 : Create and verify the project", () => projectPage.addProject({ projectName, projectDescription }))
        await test.step("Step 3 : Delete the project",()=>projectPage.deleteProject({projectName}))
    })
})