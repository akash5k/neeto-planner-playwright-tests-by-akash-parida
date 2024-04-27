import { expect } from "@playwright/test"
import { test } from "../fixtures/index"
import { faker } from "@faker-js/faker"
import LoginPage from "../poms/login"
import { TaskPage } from "../poms/task"

import { BUTTON_TEXTS } from "../constants/texts/project"
import { COMMON_TEXTS, TEST_DATA } from "../constants/common"

interface ProjectDetails {
    projectName: string
}
interface TaskDetails {
    taskName: string
    taskDescription: string
    taskComment: string
}
test.describe("Create and verify task for different user", () => {
    let firstPoject : ProjectDetails;
    let secondProject : ProjectDetails;

    let firstTask : TaskDetails;
    let secondTask : TaskDetails;

    test.beforeEach(() => {
        firstPoject = { projectName: faker.word.words({ count: 3 }) }
        secondProject = { projectName: faker.word.words({ count: 3 }) }

        firstTask = {
            taskName: faker.word.words({ count: 2 }),
            taskDescription: faker.word.words({ count: 5 }),
            taskComment: faker.word.words({ count: 5 })
        }

        secondTask = {
            taskName: faker.word.words({ count: 2 }),
            taskDescription: faker.word.words({ count: 5 }),
            taskComment: faker.word.words({ count: 5 })
        }
    })
    test("should create and verify tak for standard user", async ({
        page,
        projectPage,
        taskPage,
        browser
    }) => {
        //create a new broser context
        const standardUserContext = await browser.newContext({
            storageState: { cookies: [], origins: [] },
        })

        const standardUserPage = await standardUserContext.newPage();
        const standardUserLogin = new LoginPage(standardUserPage);
        const standUserTaskPage = new TaskPage(standardUserPage);

        //visit standard subdomain
        await standardUserPage.goto("/");
        await standardUserLogin.loginAndVerify({
            email: "cpts9gnqty9-planner-akash_parida-iiit_bh+standard@bigbinary.com",
            loginCode: "123456"
        })

        //assert no tasks assigne in standard user  --> to do method
        await standardUserPage.locator(COMMON_TEXTS.tasksNav).click();
        await expect(standardUserPage.getByRole('heading', { name: COMMON_TEXTS.assertTaskNumber })).toBeVisible();
        await standardUserPage.locator(COMMON_TEXTS.projectsNav).click();

        //create project and add standard user and add description
        await page.goto("/")
        await projectPage.addProject({ projectName: firstPoject.projectName });
        await projectPage.addStandaruserToProject();        
        await page.getByRole('button', { name: BUTTON_TEXTS.listTab }).click()
        await taskPage.addTask({ taskName: firstTask.taskName, taskAssignee: "Akash Parida Standard" });
        await taskPage.addDescriptionAndComment({ taskName: firstTask.taskName, taskDescription: firstTask.taskDescription , taskComment: firstTask.taskComment });

        await page.goto("/")
        await projectPage.addProject({ projectName: secondProject.projectName });
        await projectPage.addStandaruserToProject();        
        await page.getByRole('button', { name: BUTTON_TEXTS.listTab }).click()
        await taskPage.addTask({ taskName: secondTask.taskName, taskAssignee: "Akash Parida Standard" });
        await taskPage.addDescriptionAndComment({ taskName: secondTask.taskName, taskDescription: secondTask.taskDescription, taskComment: secondTask.taskComment });


        //verify no tasks assigned to admin user
        await page.locator(COMMON_TEXTS.tasksNav).click();
        await expect(page.getByRole('heading', { name: COMMON_TEXTS.assertTaskNumber })).toBeVisible();
        // await page.locator(COMMON_TEXTS.tasksNav).click();

        //verify task details for standard user
        await standardUserPage.reload()
        await standardUserPage.locator(COMMON_TEXTS.tasksNav).click();
        await standUserTaskPage.verifyDescriptionAndComment({ taskName: firstTask.taskName, taskDescription: firstTask.taskName, taskComment: firstTask.taskComment, taskAssignee: TEST_DATA.standardUserName });
        await standUserTaskPage.verifyDescriptionAndComment({ taskName: secondTask.taskName, taskDescription: secondTask.taskName, taskComment: secondTask.taskComment, taskAssignee: TEST_DATA.standardUserName });

    })
    test.afterEach(async ({projectPage}) => {
        //delete project
        await projectPage.deleteProject({ projectName: firstPoject.projectName });
        await projectPage.deleteProject({ projectName: secondProject.projectName });
    })
})