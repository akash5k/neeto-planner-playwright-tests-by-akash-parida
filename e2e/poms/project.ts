import { Page, expect } from "@playwright/test"
import { BUTTON_TEXTS, PLACEHOLDERS } from "../constants/texts/project"
import { PROJECT_SELECTORS } from "../constants/selectors/project"
import { COMMON_SELECTORS } from "../constants/selectors/common";
import {TEST_DATA} from "../constants/testData"

interface ProjectDetails {
    projectName: string,
    projectDescription?: string
}

export class ProjectPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    addProject = async ({ projectName, projectDescription = "" }: ProjectDetails): Promise<void> => {
        await this.page.getByRole('button', { name: BUTTON_TEXTS.addButton }).click();
        await this.page.getByPlaceholder(PLACEHOLDERS.projectName).fill(projectName);
        await this.page.getByPlaceholder(PLACEHOLDERS.projectDescription).fill(projectDescription);
        await this.page.getByRole('button', { name: BUTTON_TEXTS.saveButton }).click();
    }

    addStandaruserToProject = async (): Promise<void> => {
        await this.page
            .locator(PROJECT_SELECTORS.mainHeader)
            .locator(PROJECT_SELECTORS.menuDropDown)
            .click()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.managePeople }).click()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.addNewMember }).click()  
        await this.page.getByRole('heading', { name: TEST_DATA.standardUserName }).click()    
        await this.page.getByRole('button', { name: BUTTON_TEXTS.addAs }).click()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.regular }).click()
        await this.page.locator(COMMON_SELECTORS.panelCloseButton).click()
    }

    deleteProject = async ({ projectName }: ProjectDetails): Promise<void> => {
        await this.page.goto("/")
        await this.page.getByRole('button', { name: new RegExp(projectName, 'i') }).click()
        await this.page
            .locator(PROJECT_SELECTORS.mainHeader)
            .locator(PROJECT_SELECTORS.menuDropDown)
            .click()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.delete }).click()
        await expect(this.page.getByRole('heading', { name: BUTTON_TEXTS.deleteProject })).toBeVisible()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.delete }).click()
    }

}
