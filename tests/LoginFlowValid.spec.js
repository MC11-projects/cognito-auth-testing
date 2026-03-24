import { test, expect } from '@playwright/test';
// import dotenv from 'dotenv' //enable only for local tests
// dotenv.config() //enable only for local tests

test.beforeEach(async ({page}) => {
    const baseUrl = process.env.BASE_URL
    await page.goto(baseUrl)
    await page.getByText('Login with Cognito').click()
    await page.getByRole('textbox', {name: 'Email address'}).waitFor({ timeout: 10000 })
})

test('User Login 1', async({page}) => {
    const email = process.env.TEST_EMAIL1
    const password = process.env.TEST_PASSWORD1

    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await page.getByRole('textbox', {name: 'Password'}).waitFor({ timeout: 10000 })
    await page.getByRole('textbox', {name: 'Password'}).fill(password)
    await page.getByText('Continue').click()

    await expect(page.getByText('Access Token')).toBeVisible()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()

})

test('User Login 2', async({page}) => {
    const email = process.env.TEST_EMAIL2
    const password = process.env.TEST_PASSWORD2

    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await page.getByRole('textbox', {name: 'Password'}).waitFor({ timeout: 10000 })
    await page.getByRole('textbox', {name: 'Password'}).fill(password)
    await page.getByText('Continue').click()

    await expect(page.getByText('Access Token')).toBeVisible()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()

})

test('Login-Logout', async ({page}) => {
    const email = process.env.TEST_EMAIL2
    const password = process.env.TEST_PASSWORD2

    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await page.getByRole('textbox', {name: 'Password'}).waitFor({ timeout: 10000 })
    await page.getByRole('textbox', {name: 'Password'}).fill(password)
    await page.getByText('Continue').click()
    
    await page.getByText('Logout').click()

    await page.getByText('Login with Cognito').click()
    await page.getByRole('textbox', {name: 'Email address'}).waitFor({ timeout: 10000 })
    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await page.getByRole('textbox', {name: 'Password'}).waitFor({ timeout: 10000 })
    await page.getByRole('textbox', {name: 'Password'}).fill(password)
    await page.getByText('Continue').click()

    await page.getByText('Logout').click()
    await expect(page.getByText('AWS Cognito Authentication Test')).toBeVisible()
})