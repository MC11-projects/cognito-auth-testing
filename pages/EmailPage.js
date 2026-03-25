import { page } from "@playwright/test";

export class EmailPage {

    constructor(page){
        this.page = page
    }

    async EmailInput(email){
        const FillEmail = this.page.getByRole('textbox', {name: 'Email address'})
        await FillEmail.waitFor({timeout: 10000})
        await FillEmail.fill(email)
    }

    async clickNextButton() {
        const ClickNext = this.page.getByText('Next')
        await ClickNext.click()
    }

}