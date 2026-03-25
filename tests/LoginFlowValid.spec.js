import { test, expect } from '@playwright/test';
import dotenv from 'dotenv'
import fs from 'fs'
import { EmailPage } from '../pages/EmailPage';
import { PasswordPage } from '../pages/PasswordPage';
import { PasswordResetPage } from '../pages/PasswordResetPage';

if (fs.existsSync('.env')) {
    dotenv.config()
}

let emailPage
let passwordPage

test.beforeEach(async ({page}) => {
    const baseUrl = process.env.BASE_URL
    emailPage = new EmailPage(page)
    passwordPage = new PasswordPage(page)
    await page.goto(baseUrl)
    await page.getByText('Login with Cognito').click()
    await page.getByRole('textbox', {name: 'Email address'}).waitFor({ timeout: 10000 })
})

test('User Login 1', async({page}) => {
    const email = process.env.TEST_EMAIL1
    const password = process.env.TEST_PASSWORD1

    await emailPage.EmailInput(email)
    await emailPage.clickNextButton()
    await passwordPage.PasswordInput(password)
    await passwordPage.clickContinue()

    await expect(page.getByText('Access Token')).toBeVisible()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()

})

test('User Login 2', async({page}) => {
    const email = process.env.TEST_EMAIL2
    const password = process.env.TEST_PASSWORD2

    await emailPage.EmailInput(email)
    await emailPage.clickNextButton()
    await passwordPage.PasswordInput(password)
    await passwordPage.clickContinue()

    await expect(page.getByText('Access Token')).toBeVisible()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()

})

test('Login-Logout', async ({page}) => {
    const email = process.env.TEST_EMAIL2
    const password = process.env.TEST_PASSWORD2

    await emailPage.EmailInput(email)
    await emailPage.clickNextButton()
    await passwordPage.PasswordInput(password)
    await passwordPage.clickContinue()
    
    await page.getByText('Logout').click()

    await page.getByText('Login with Cognito').click()
    await emailPage.EmailInput(email)
    await emailPage.clickNextButton()
    await passwordPage.PasswordInput(password)
    await passwordPage.clickContinue()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()
})

test('Show your password checkbox', async ({page}) => {
    const email = process.env.TEST_EMAIL1

    await emailPage.EmailInput(email)
    await emailPage.clickNextButton()
    await passwordPage.PasswordInput('password')
    await passwordPage.clickContinue()
    await expect(page.locator('.awsui_input_2rhyz_uz5yt_149')).toHaveAttribute('type', 'password')
    await passwordPage.toggleShowPassword()
    await expect(page.locator('.awsui_input_2rhyz_uz5yt_149')).toHaveAttribute('type', 'text')
    await passwordPage.toggleShowPassword()
    await expect(page.locator('.awsui_input_2rhyz_uz5yt_149')).toHaveAttribute('type', 'password')
})

test('Forgot your password UI check', async({page}) => {
    const email = process.env.TEST_EMAIL3
    const resetPage = new PasswordResetPage(page)

    await emailPage.EmailInput(email)
    await emailPage.clickNextButton()
    await passwordPage.clickForgotPassword()
    await emailPage.EmailInput(email)
    await resetPage.ResetMyPasswordButton()
    await resetPage.validateResetPageUI()

})