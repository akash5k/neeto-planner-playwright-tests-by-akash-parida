import { expect } from "@playwright/test";
import { test } from "../fixtures/index";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";
import { TaskPage } from "../poms/task";

import { BUTTON_TEXTS } from "../constants/texts/project";
import {COMMON_SELECTORS} from "../constants/selectors/common";
import { TEST_DATA } from "../constants/testData";

interface Project {
    projectName: string;
    taskName: string;
    taskDescription: string;
    taskComment: string;
    taskAssignee?: string;
}

test.describe("Create and verify task for different user", () => {
    let loginCode: string;

    let projects: Project[];

    test.beforeEach(() => {
        loginCode = faker.string.numeric(6);

        projects = Array.from({ length: 2 }, () => ({
            projectName: faker.word.words({ count: 3 }),
            taskName: faker.word.words({ count: 2 }),
            taskDescription: faker.word.words({ count: 5 }),
            taskComment: faker.word.words({ count: 5 }),
            taskAssignee: TEST_DATA.standardUserName
        }));
    });

    test("should create and verify task for standard user", async ({ page, projectPage, taskPage, browser }) => {
        // Create a new browser context for standard user
        const standardUserContext = await browser.newContext({
            storageState: { cookies: [], origins: [] },
        });

        const standardUserPage = await standardUserContext.newPage();
        const standardUserLogin = new LoginPage(standardUserPage);
        const standardUserTaskPage = new TaskPage(standardUserPage);

        await test.step("Step 1: Login as standard user", async () => {
            await standardUserPage.goto("/");
            await standardUserLogin.loginAndVerify({
                email: TEST_DATA.standardUserEmail,
                loginCode: loginCode
            });
        })

        await test.step("Step 2: Assert there are no assigned tasks for standard user", async () => {
            await page.getByTestId(COMMON_SELECTORS.tasksNav).click();
            for(let project of projects){
                await expect(page.getByRole('cell', { name: new RegExp(project.taskName, 'i')})).toBeHidden();                
            }
            await page.getByTestId(COMMON_SELECTORS.projectsNav).click();
        })

        await test.step("Step 3: Create projects and tasks", async () => {
            for (const project of projects) {
                await page.goto("/");
                await projectPage.addProject({ projectName: project.projectName });
                await projectPage.addStandaruserToProject();
                await page.getByRole('button', { name: BUTTON_TEXTS.listTab }).click();
                await taskPage.addTask({ taskName: project.taskName, taskAssignee: TEST_DATA.standardUserName });
                await taskPage.addDescriptionAndComment({ taskName: project.taskName, taskDescription: project.taskDescription, taskComment: project.taskComment });
            }
        })

        await test.step("Step 4: Verify tasks in Tasks section for standard user", async () => {
            await standardUserPage.reload();
            await standardUserPage.getByTestId(COMMON_SELECTORS.tasksNav).click();
            for (const task of projects) {
                await standardUserTaskPage.verifyDescriptionAndComment(task);
            }
 
            await standardUserPage.close();
            await standardUserContext.close();
        })
    });

    test.afterEach(async ({ projectPage }) => {
        for (const project of projects) {
            await projectPage.deleteProject({ projectName: project.projectName });
        }
    });
});
