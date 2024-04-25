import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { test } from "../fixtures/index";

test.describe("Create and verify tasks", () => {
    let firstProjectName: string;
    let firstTaskName: string;
    let firstTaskDescription: string;
    let firstTaskComment: string;

    let secondProjectName: string;
    let secondTaskName: string;
    let secondTaskDescription: string;
    let secondTaskComment: string;

    test.beforeEach(() => {
        firstProjectName = faker.word.words({ count: 3 });
        firstTaskName = faker.word.words({ count: 2 });
        firstTaskDescription = faker.word.words({ count: 5 });
        firstTaskComment = faker.word.words({ count: 5 });

        secondProjectName = faker.word.words({ count: 3 });
        secondTaskName = faker.word.words({ count: 2 });
        secondTaskDescription = faker.word.words({ count: 5 });
        secondTaskComment = faker.word.words({ count: 5 });
    });

    test("should create and verify tasks", async ({ page, projectPage, taskPage }) => {
        await test.step("Step 1: Navigate to base URL", async () => {
            await page.goto("/");
        });

        await test.step("Step 2: Assert there are no assigned tasks currently", async () => {
            await page.locator('[data-testid="navlink-tasks"]').click();
            await expect(page.getByRole('heading', { name: '0 tasks' })).toBeVisible();
            await page.locator('[data-testid="navlink-projects"]').click();
        });

        await test.step("Step 3: Create first project and task", async () => {
            await projectPage.addProject({ projectName: firstProjectName });
            await taskPage.addTask({ taskName: firstTaskName, taskAssignee: 'Akash Parida' });
            await taskPage.addDescriptionAndComment({
                taskName: firstTaskName,
                taskDescription: firstTaskDescription,
                taskComment: firstTaskComment
            });
            //navigate to base url for locator to find add project button
            await page.goto("/")
        });
        await test.step("Step 4: Create second project and task", async () => {
            await projectPage.addProject({ projectName: secondProjectName });
            await taskPage.addTask({ taskName: secondTaskName, taskAssignee: 'Akash Parida' });
            await taskPage.addDescriptionAndComment({
                taskName: secondTaskName,
                taskDescription: secondTaskDescription,
                taskComment: secondTaskComment
            });
        });

        await test.step("Step 5: Verify tasks in Tasks section", async () => {
            await page.locator('[data-testid="navlink-tasks"]').click();
            await taskPage.verifyDescriptionAndComment({
                taskName: firstTaskName,
                taskDescription: firstTaskDescription,
                taskComment: firstTaskComment,
                taskAssignee: 'Akash Parida'
            });
            await page.locator('[data-cy="pane-close-button"]').click()
            await taskPage.verifyDescriptionAndComment({
                taskName: secondTaskName,
                taskDescription: secondTaskDescription,
                taskComment: secondTaskComment,
                taskAssignee: 'Akash Parida'
            });
        });

        await test.step("Step 6: Delete the created projects", async () => {
            await projectPage.deleteProject({ projectName: firstProjectName });
            await projectPage.deleteProject({ projectName: secondProjectName });
        });
    });
});
