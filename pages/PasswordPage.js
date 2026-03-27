// Page Object for Cognito password screen - handles password input and navigation to home page/forgot password screen

export class PasswordPage {

    constructor(page){
        this.page = page
    }

    async PasswordInput(password){
        const FillPassword = this.page.getByRole('textbox', {name: 'Password'})
        await FillPassword.waitFor({timeout: 25000}) // Longer timeout than email screen - password screen consistently takes more time to load after email validation
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