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

test('Empty Email field', async ({page}) => {
    const email = process.env.TEST_EMAIL1
    
    await page.getByRole('textbox', {name: 'Email address'})
    await page.getByText('Next').click()
    await expect(page.getByText('Missing email address')).toBeVisible()

})

test('Empty Password field', async ({page}) => {
    const email = process.env.TEST_EMAIL1
    const password = process.env.TEST_PASSWORD1
    
    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await page.getByRole('textbox', {name: 'Password'}).waitFor({ timeout: 10000 })
    await page.getByRole('textbox', {name: 'Password'})
    await page.getByText('Continue').click()
    await expect(page.getByText('Missing password.')).toBeVisible()

})

test('Invalid Email', async ({page}) => {
    await page.getByRole('textbox', {name: 'Email address'}).fill('test1')
    await page.getByText('Next').click()
    await expect(page.getByText('Invalid email address.')).toBeVisible()

})

test('Invalid Password', async ({page}) => {
    const email = process.env.TEST_EMAIL1
    const passwordField = page.getByRole('textbox', {name: 'Password'})
    
    await page.getByRole('textbox', {name: 'Email address'}).fill(email)
    await page.getByText('Next').click()
    await passwordField.waitFor({timeout: 10000})
    await passwordField.click()
    await passwordField.fill('password')
    await page.getByText('Continue').click()
    await expect(page.getByText('Invalid input: Incorrect username or password.', {exact: true})).toBeVisible()

})
