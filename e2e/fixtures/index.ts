//fixtures/index.ts

import {test as base} from "@playwright/test"
import LoginPage from "../poms/login"
import {ProjectPage} from "../poms/project";
import { TaskPage } from "../poms/task";

interface ExtendFixtures {
    loginPage : LoginPage;
    projectPage : ProjectPage;
    taskPage : TaskPage;
}

export const test = base.extend<ExtendFixtures>({
    loginPage: async ({page},use) =>{
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    projectPage: async ({page},use) =>{
        const projectPage = new ProjectPage(page);
        await use(projectPage);
    },
    taskPage: async ({page},use) =>{
        const projectPage = new TaskPage(page);
        await use(projectPage);
    }
})