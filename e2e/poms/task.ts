import { Page, expect } from "@playwright/test"
import { COMMON_SELECTORS, COMMON_TEXTS } from "../constants/common";
import {BUTTON_TEXTS, INPUT_SELECTORS, TEXT_SELECTOR} from "../constants/texts/task"
import { SELECTORS } from "../constants/selectors/task";

interface TaskDetails {
    taskName: string,
    taskAssignee: string
}
interface TaskDescription {
    taskName: string,
    taskDescription: string,
    taskComment: string
}
export class TaskPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    addTask = async ({ taskName, taskAssignee }: TaskDetails): Promise<void> => {
        await this.page.getByRole('button', { name: BUTTON_TEXTS.addTaskButton }).click()
        await this.page.locator(INPUT_SELECTORS.addTask).fill(taskName);
        await this.page.locator(SELECTORS.taskInput).click();
        await this.page.getByRole('row', { name: new RegExp(taskName, 'i') }).getByRole('button').nth(2).click({
            timeout: 5000
        });
        await this.page.getByRole('button', { name: new RegExp(taskAssignee, 'i') }).click({
            timeout: 5000
        })
        await this.page.locator(SELECTORS.onBlur).click();
    }

    addDescriptionAndComment = async ({ taskName, taskDescription, taskComment }:TaskDescription): Promise<void> => {
        await this.page.getByRole('cell', { name: new RegExp(taskName, 'i') })
            .getByText(new RegExp(taskName, 'i')).click({ timeout: 5000 })
        await this.page.getByText(TEXT_SELECTOR.addDescription).click();
        await this.page.locator(SELECTORS.addMoreDetails).fill(taskDescription);
        await this.page.getByRole('button', { name: BUTTON_TEXTS.saveChanges }).click();
        await expect(this.page.getByRole('button', { name: BUTTON_TEXTS.saveChanges })).not.toBeVisible();
        await this.page.getByRole('textbox', { name: INPUT_SELECTORS.paragraphInput }).getByRole('paragraph').fill(taskComment);
        await this.page.getByRole('button', { name: BUTTON_TEXTS.commentButton, exact: true }).click()
        await this.page.locator(COMMON_SELECTORS.pannelCloseButton).click();
    }

    verifyDescriptionAndComment = async ({ taskName, taskDescription, taskComment, taskAssignee }: { taskName: string, taskDescription: string, taskComment: string, taskAssignee: string }): Promise<void> => {
        
        await this.page.getByRole('cell', { name: new RegExp(taskName, 'i') }).getByText(new RegExp(taskName, 'i')).click({ timeout: 5000 })
        await expect(this.page.locator(SELECTORS.formWrapper).getByText(new RegExp(`Assignee${taskAssignee}`, 'i'))).toBeVisible()
        // await expect(this.page.locator('[data-cy="neeto-editor-content"]').filter({ hasText: taskDescription }).nth(0)).toBeVisible({
        //     timeout: 5000
        // }); //working on task.spec -->todo
        await expect(this.page.getByText(taskComment).first()).toBeVisible();
        await this.page.locator(COMMON_SELECTORS.pannelCloseButton).click();
    }
}