import { Page, expect } from "@playwright/test"


export class TaskPage {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    addTask = async ({ taskName, taskAssignee }: { taskName: string, taskAssignee: string }): Promise<void> => {
        await this.page.getByRole('button', { name: 'Add new task' }).click()
        await this.page.locator('[data-cy="nui-input-field"]').fill(taskName);
        await this.page.locator('[data-testid="neeto-molecules-autosave-input-save"]').click();
        await this.page.getByRole('row', { name: new RegExp(taskName, 'i') }).getByRole('button').nth(2).click();
        await this.page.waitForTimeout(1000)
        await this.page.getByRole('button', { name: new RegExp(taskAssignee, 'i') }).click()
        await this.page.waitForTimeout(1000)
        await this.page.getByText('NameAssigneeDue dateNew Tasks').click()
    }

    addDescriptionAndComment = async ({ taskName, taskDescription, taskComment }: { taskName: string, taskDescription: string, taskComment: string }): Promise<void> => {
        await this.page.locator('div').filter({ hasText: new RegExp(`^${taskName}`) }).first().click()
        await this.page.getByText('Add a description here.').click();
        await this.page.locator('div').filter({ hasText: /^ParagraphSave changesCancelAdd attachment$/ }).getByRole('paragraph').fill(taskDescription)
        await this.page.getByRole('button', { name: 'Save changes' }).click();
        await this.page.locator('div').filter({ hasText: /^CommentsActivitiesParagraphComment$/ }).click();
        await this.page.getByRole('textbox', { name: 'editor-content' }).getByRole('paragraph').fill(taskComment);
        await this.page.getByRole('button', { name: 'Comment', exact: true }).click()
        await this.page.locator('[data-cy ="pane-close-button"]').click();
    }

    verifyDescriptionAndComment = async ({ taskName, taskDescription, taskComment ,taskAssignee}: { taskName: string, taskDescription: string, taskComment: string,taskAssignee:string }): Promise<void> => {
        await this.page.locator('[data-testid="navlink-tasks"]').click();
        await this.page.getByRole('button', { name: new RegExp(taskName, 'i') }).click();
        await this.page.locator('form').filter({ hasText: `'Assignee${taskAssignee}' `})
        await expect(this.page.locator('[data-cy="neeto-editor-content"]').filter({ hasText: taskDescription }).nth(0)).toBeVisible({
            timeout: 5000
        });
        await expect(this.page.getByText(taskComment.slice(0, 1)).nth(1)).toBeVisible({
            timeout: 5000
        });
    }
}