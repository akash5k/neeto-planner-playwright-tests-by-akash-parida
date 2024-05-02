import { Page, expect } from "@playwright/test"
import {BUTTON_TEXTS, TEXT_SELECTOR} from "../constants/texts/task"
import { TASK_SELECTORS } from "../constants/selectors/task";
import {COMMON_SELECTORS} from "../constants/selectors/common";

interface TaskDetails {
    taskName: string,
    taskAssignee: string
}
interface TaskDescription extends TaskDetails {
    taskDescription: string,
    taskComment: string,
}
export class TaskPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    addTask = async ({ taskName, taskAssignee }: TaskDetails): Promise<void> => {
        await this.page.getByRole('button', { name: BUTTON_TEXTS.addTaskButton }).click()
        await this.page.getByTestId(TASK_SELECTORS.taskInput).fill(taskName);
        await this.page.getByTestId(TASK_SELECTORS.taskInputSave).click();
        await this.page.getByRole('row', { name: new RegExp(taskName, 'i') }).getByRole('cell').locator('span').getByRole('button').click();
        await this.page.getByRole('button', { name: new RegExp(taskAssignee, 'i') }).click();
        await this.page.locator(TASK_SELECTORS.onBlur).click();
    }

    addDescriptionAndComment = async ({ taskName, taskDescription, taskComment }:TaskDescription): Promise<void> => {
        await this.page.getByRole('cell', { name: new RegExp(taskName, 'i') })
            .getByText(new RegExp(taskName, 'i')).click()
        await this.page.getByText(TEXT_SELECTOR.addDescription).click();
        await this.page.locator(TASK_SELECTORS.addMoreDetails).fill(taskDescription);
        await this.page.getByRole('button', { name: BUTTON_TEXTS.saveChanges }).click();
        await expect(this.page.getByRole('button', { name: BUTTON_TEXTS.saveChanges })).toBeHidden();
        await this.page.getByRole('textbox', { name: TASK_SELECTORS.paragraphInput }).getByRole('paragraph').fill(taskComment);
        await this.page.getByRole('button', { name: BUTTON_TEXTS.commentButton, exact: true }).click()
        await this.page.locator(COMMON_SELECTORS.panelCloseButton).click();
    }

    verifyDescriptionAndComment = async ({ taskName, taskDescription, taskComment, taskAssignee }:TaskDescription): Promise<void> => {        
        await this.page.getByRole('cell', { name: new RegExp(taskName, 'i') }).getByText(new RegExp(taskName, 'i')).click()
        await expect(this.page.getByText(new RegExp(`Assignee${taskAssignee}`, 'i'))).toBeVisible()
        await expect(this.page.locator(TASK_SELECTORS.taskDescription).filter({ hasText: taskDescription })).toBeVisible(); 
        await expect(this.page.getByText(taskComment)).toBeVisible();
        await this.page.locator(COMMON_SELECTORS.panelCloseButton).click();
    }
}