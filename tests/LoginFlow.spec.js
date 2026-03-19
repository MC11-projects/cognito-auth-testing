import { test, expect } from '@playwright/test';
// import dotenv from 'dotenv'
// dotenv.config()

test('User Login', async({page}) => {
    const email = process.env.TEST_EMAIL1
    const password = process.env.TEST_PASSWORD1
    const baseUrl = process.env.BASE_URL

    await page.goto(baseUrl)
    await page.screenshot({ path: 'screenshot-1-homepage.png' })
    await page.getByText('Login with Cognito').click()
    await page.screenshot({ path: 'screenshot-2-after-click.png' })
    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.screenshot({ path: 'screenshot-3-email-filled.png' })
    await page.getByText('Next').click()
    await page.screenshot({ path: 'screenshot-4-after-next.png' })
    await page.getByRole('textbox', {name: 'Password'}).waitFor()
    await page.getByRole('textbox', {name: 'Password'}).fill(password)
    await page.getByText('Continue').click()

    await expect(page.getByText('Access Token')).toBeVisible()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()

})