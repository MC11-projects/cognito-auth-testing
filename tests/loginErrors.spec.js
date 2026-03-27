// This file tests error scenarios/negative test cases for Cognito authentication
import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'
import fs from 'fs'
import { EmailPage } from '../pages/EmailPage'
import { PasswordPage } from '../pages/PasswordPage'

// Conditional for CI which does not get the .env file, gets variables from Github secrets
if (fs.existsSync('.env')) {
    dotenv.config()
}

// POM variables that are shared across all tests, created in beforeEach and used in the tests themselves
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

test('Empty Email field', async ({page}) => {
    const email = process.env.TEST_EMAIL1
    
    await emailPage.clickNextButton()
    await expect(page.getByText('Missing email address')).toBeVisible()

})

test('Empty Password field', async ({page}) => {
    const email = process.env.TEST_EMAIL1
    const password = process.env.TEST_PASSWORD1
    
    await emailPage.EmailInput(email)
    await emailPage.clickNextButton()
    await passwordPage.PasswordInput('')
    await passwordPage.clickContinue()
    await expect(page.getByText('Missing password.')).toBeVisible()

})

test('Invalid Email', async ({page}) => {
    await emailPage.EmailInput('test1')
    await emailPage.clickNextButton()
    await expect(page.getByText('Invalid email address.')).toBeVisible()

})

test('Invalid Password', async ({page}) => {
    const email = process.env.TEST_EMAIL1
    
    await emailPage.EmailInput(email)
    await emailPage.clickNextButton()
    await passwordPage.PasswordInput('password')
    await passwordPage.clickContinue()
    await expect(page.getByText('Invalid input: Incorrect username or password.', {exact: true})).toBeVisible()

})
