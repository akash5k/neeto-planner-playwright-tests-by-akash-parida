import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { test } from "../fixtures/index";

import {  COMMON_TEXTS, TEST_DATA } from "../constants/common";

interface Project {
    projectName: string;
    taskName: string;
    taskDescription: string;
    taskComment: string;
    taskAssignee: string;
}

test.describe("Create and verify tasks", () => {
    let projects: Project[];
   

    test.beforeEach(() => {
        projects = Array.from({ length: 2 }, () => ({
            projectName: faker.word.words({ count: 3 }),
            taskName: faker.word.words({ count: 2 }),
            taskDescription: faker.word.words({ count: 5 }),
            taskComment: faker.word.words({ count: 5 }),
            taskAssignee: TEST_DATA.userName
        }));
    });

    test("should create and verify tasks", async ({ page, projectPage, taskPage }) => {
        await test.step("Step 1: Navigate to base URL",  () => {
             page.goto("/");
        });

        await test.step("Step 2: Assert there are no assigned tasks", async () => {
            await page.locator(COMMON_TEXTS.tasksNav).click();
            await expect(page.getByRole('heading', { name: '0 tasks' })).toBeVisible();
            await page.locator(COMMON_TEXTS.projectsNav).click();
        });

        await test.step("Step 3: Create projects and tasks", async () => {
            
            for (const project of projects) {
                await page.goto("/");
                await projectPage.addProject({ projectName: project.projectName });
                await taskPage.addTask({ taskName: project.taskName, taskAssignee: project.taskAssignee });
                await taskPage.addDescriptionAndComment({ taskName: project.taskName, taskDescription: project.taskDescription, taskComment: project.taskComment });
            }
            
        });

        await test.step("Step 4: Verify tasks in Tasks section", async () => {
            await page.locator(COMMON_TEXTS.tasksNav).click();
            for (const task of projects) {
                await taskPage.verifyDescriptionAndComment(task);
            }
        });
    });
    test.afterEach(async ({ projectPage }) => {
        for (const projectName of projects) {
            await projectPage.deleteProject({ projectName:projectName.projectName });
        }
    })
});
