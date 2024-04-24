import { Page, expect } from "@playwright/test"
import { BUTTON_TEXTS ,INPUT_SELECTORS} from "../constants/texts/project"


interface ProjectDetails {
    projectName: string,
    projectDescription: string
}
export class ProjectPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    addProject = async ({ projectName, projectDescription }: ProjectDetails) => {

        await this.page.getByRole('button', { name: BUTTON_TEXTS.addButton }).click();        
        await this.page.getByPlaceholder(INPUT_SELECTORS.projectName).fill(projectName);
        await this.page.getByPlaceholder(INPUT_SELECTORS.projectDescription).fill(projectDescription);
        await this.page.getByRole('button', { name: BUTTON_TEXTS.saveButton }).click();

        //verify project creation
        await expect(this.page.getByText(projectName)).toBeVisible();
    }
}
