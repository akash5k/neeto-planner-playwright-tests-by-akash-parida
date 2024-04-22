import { Page, expect } from "@playwright/test"


interface projectDetails {
    projectName: string,
    projectDescription: string
}
export class ProjectPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    addProject = async ({ projectName, projectDescription }: projectDetails) => {

        await this.page.getByRole('button', { name: 'Add new project' }).click();
        await this.page.getByPlaceholder('Enter project name').fill(projectName);
        await this.page.getByPlaceholder('Enter description').fill(projectDescription);
        await this.page.getByRole('button', { name: 'Save changes' }).click();

        //verify project creation
        await expect(this.page.getByText(projectName)).toBeVisible();
    }
}
