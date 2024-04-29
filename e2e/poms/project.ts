import { Page, expect } from "@playwright/test"
import { BUTTON_TEXTS, INPUT_SELECTORS } from "../constants/texts/project"
import { SELECTORS } from "../constants/selectors/project"
import { COMMON_SELECTORS } from "../constants/common";
import {TEST_DATA} from "../constants/common"

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
        //goto main page
        await this.page.getByRole('button', { name: BUTTON_TEXTS.addButton }).click();
        await this.page.getByPlaceholder(INPUT_SELECTORS.projectName).fill(projectName);
        await this.page.getByPlaceholder(INPUT_SELECTORS.projectDescription).fill(projectDescription);
        await this.page.getByRole('button', { name: BUTTON_TEXTS.saveButton }).click();
    }

    addStandaruserToProject = async (): Promise<void> => {
        await this.page
            .locator(SELECTORS.mainHeader)
            .locator(SELECTORS.menuDropDown)
            .click()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.managePeople }).click()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.addNewMember }).click()  
        await this.page.getByRole('heading', { name: TEST_DATA.standardUserName }).click()    
        await this.page.getByRole('button', { name: BUTTON_TEXTS.addAs }).click()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.regular }).click()
        await this.page.locator(COMMON_SELECTORS.pannelCloseButton).click()
    }

    deleteProject = async ({ projectName }: ProjectDetails): Promise<void> => {
        await this.page.goto("/")
        await this.page.getByRole('button', { name: new RegExp(projectName, 'i') }).click()
        await this.page
            .locator(SELECTORS.mainHeader)
            .locator(SELECTORS.menuDropDown)
            .click()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.delete }).click()
        await expect(this.page.getByRole('heading', { name: BUTTON_TEXTS.deleteProject })).toBeVisible()
        await this.page.getByRole('button', { name: BUTTON_TEXTS.delete }).click()
    }

}
