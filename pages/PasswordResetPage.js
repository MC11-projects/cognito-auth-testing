import { page, expect } from "@playwright/test";

export class PasswordResetPage {

    constructor(page){
        this.page = page
    }

    async ResetMyPasswordButton() {
        const ResetPasswordButton = this.page.getByRole('button', {name: 'Reset my password'})
        await ResetPasswordButton.click()
    }

    async validateResetPageUI() {
        await expect(this.page.getByText('Reset password', {exact: true})).toBeVisible()
        await expect(this.page.getByText('We have sent a password reset code in an Email message to t***@e***. Enter your code and your new password.')).toBeVisible()
        await expect(this.page.getByText('Code', {exact: true})).toBeVisible()
        await expect(this.page.getByPlaceholder('Enter code')).toBeVisible()
        await expect(this.page.getByText('New password', {exact: true})).toBeVisible()
        await expect(this.page.getByPlaceholder('Enter new password', {exact: true})).toBeVisible()
        await expect(this.page.getByText('Confirm new password', {exact: true})).toBeVisible()
        await expect(this.page.getByPlaceholder('Reenter new password')).toBeVisible()
        await expect(this.page.getByRole('checkbox', {name: 'Show Password'})).toBeVisible()
        await expect(this.page.getByRole('button', {name: 'Change password'})).toBeVisible()
        await expect(this.page.getByRole('button', {name: 'Back'})).toBeVisible()
    }
}