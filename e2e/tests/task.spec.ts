import { expect } from "@playwright/test";
import { faker, fi } from "@faker-js/faker";
import { test } from "../fixtures/index";
import { COMMON_SELECTORS, COMMON_TEXTS, TEST_DATA } from "../constants/common";

test.describe("Create and verify tasks", () => {
    let projectNames: string[];
    let taskNames: string[];
    let taskDescriptions: string[];
    let taskComments: string[];

    test.beforeEach(() => {
        projectNames = [faker.word.words({ count: 3 }), faker.word.words({ count: 3 })];
        taskNames = [faker.word.words({ count: 2 }), faker.word.words({ count: 2 })];
        taskDescriptions = [faker.word.words({ count: 5 }), faker.word.words({ count: 5 })];
        taskComments = [faker.word.words({ count: 5 }), faker.word.words({ count: 5 })];
    });

    test("should create and verify tasks", async ({ page, projectPage, taskPage }) => {
        await test.step("Step 1: Navigate to base URL", async () => {
            await page.goto("/");
        });

        await test.step("Step 2: Assert there are no assigned tasks", async () => {
            await page.locator(COMMON_TEXTS.tasksNav).click();
            await expect(page.getByRole('heading', { name: '0 tasks' })).toBeVisible();
            await page.locator(COMMON_TEXTS.projectsNav).click();
        });

        await test.step("Step 3: Create projects and tasks", async () => {
            for (let i = 0; i < projectNames.length; i++) {
                await projectPage.addProject({ projectName: projectNames[i] });
                await taskPage.addTask({ taskName: taskNames[i], taskAssignee: TEST_DATA.userName });
                await taskPage.addDescriptionAndComment({
                    taskName: taskNames[i],
                    taskDescription: taskDescriptions[i],
                    taskComment: taskComments[i]
                });
                await page.goto("/");
            }
        });

        await test.step("Step 4: Verify tasks in Tasks section", async () => {
            await page.locator(COMMON_TEXTS.tasksNav).click();
            for (let i = 0; i < taskNames.length; i++) {
                await taskPage.verifyDescriptionAndComment({
                    taskName: taskNames[i],
                    taskDescription: taskDescriptions[i],
                    taskComment: taskComments[i],
                    taskAssignee: TEST_DATA.userName
                });
            }
        });
    });
    test.afterEach(async ({ projectPage }) => {
        for (let projectName of projectNames) {
            await projectPage.deleteProject({ projectName });
        }
    })
});
