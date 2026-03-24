import { test, expect } from '@playwright/test';
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
    dotenv.config()
}

test.beforeEach(async ({page}) => {
    const baseUrl = process.env.BASE_URL
    await page.goto(baseUrl)
    await page.getByText('Login with Cognito').click()
    await page.getByRole('textbox', {name: 'Email address'}).waitFor({ timeout: 10000 })
})

test('User Login 1', async({page}) => {
    const email = process.env.TEST_EMAIL1
    const password = process.env.TEST_PASSWORD1
    const passwordField = page.getByRole('textbox', {name: 'Password'})

    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await passwordField.waitFor({timeout: 10000})
    await passwordField.click()
    await passwordField.fill(password)
    await page.getByText('Continue').click()

    await expect(page.getByText('Access Token')).toBeVisible()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()

})

test('User Login 2', async({page}) => {
    const email = process.env.TEST_EMAIL2
    const password = process.env.TEST_PASSWORD2
    const passwordField = page.getByRole('textbox', {name: 'Password'})

    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await passwordField.waitFor({timeout: 10000})
    await passwordField.click()
    await passwordField.fill(password)
    await page.getByText('Continue').click()

    await expect(page.getByText('Access Token')).toBeVisible()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()

})

test('Login-Logout', async ({page}) => {
    const email = process.env.TEST_EMAIL2
    const password = process.env.TEST_PASSWORD2
    const passwordField = page.getByRole('textbox', {name: 'Password'})

    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await passwordField.waitFor({timeout: 20000})
    await passwordField.click()
    await passwordField.fill(password)
    await page.getByText('Continue').click()
    
    await page.getByText('Logout').click()

    await page.getByText('Login with Cognito').click()
    await page.getByRole('textbox', {name: 'Email address'}).waitFor({ timeout: 10000 })
    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await passwordField.waitFor({timeout: 20000})
    await passwordField.click()
    await passwordField.fill(password)
    await page.getByText('Continue').click()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()
})

test('Show your password checkbox', async ({page}) => {
    const email = process.env.TEST_EMAIL1
    const passwordField = page.getByRole('textbox', {name: 'Password'})

    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await passwordField.waitFor({timeout: 10000})
    await passwordField.click()
    await passwordField.fill('password')
    await expect(page.locator('.awsui_input_2rhyz_uz5yt_149')).toHaveAttribute('type', 'password')
    await page.getByRole('checkbox', {name: 'Show Password'}).click()
    await expect(page.locator('.awsui_input_2rhyz_uz5yt_149')).toHaveAttribute('type', 'text')
    await page.getByRole('checkbox', {name: 'Show Password'}).click()
    await expect(page.locator('.awsui_input_2rhyz_uz5yt_149')).toHaveAttribute('type', 'password')
})