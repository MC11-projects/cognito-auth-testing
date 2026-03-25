import { page } from "@playwright/test";
import { timeLog } from "console";
import { TIMEOUT } from "dns";

export class PasswordPage {

    constructor(page){
        this.page = page
    }

    async PasswordInput(password){
        const FillPassword = this.page.getByRole('textbox', {name: 'Password'})
        await FillPassword.waitFor({timeout: 15000})
        await FillPassword.fill(password)
    }

    async clickContinue() {
        const ClickContinue = this.page.getByText('Continue')
        await ClickContinue.click()
    }

    async toggleShowPassword() {
        const ShowPasswordButton = this.page.getByRole('checkbox', {name: 'Show Password'})
        await ShowPasswordButton.click()
    }
        
    async clickForgotPassword() {
        const ForgotYourPasswordButton = this.page.getByText('Forgot your password?', {exact: true})
        await ForgotYourPasswordButton.click()
    }
    
}