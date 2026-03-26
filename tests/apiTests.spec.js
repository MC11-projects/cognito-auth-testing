import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'
import fs from 'fs'
import { EmailPage } from '../pages/EmailPage'
import { PasswordPage } from '../pages/PasswordPage'

if (fs.existsSync('.env')) {
    dotenv.config()
}

const API_BASE_URL = 'https://zgw5kb3ajl.execute-api.us-east-1.amazonaws.com/prod' // Add this to .env later
let idToken
let createdItemId
let emailPage
let passwordPage

test.beforeEach(async ({page}) => {
    const baseUrl = process.env.BASE_URL
    const email = process.env.TEST_EMAIL1
    const password = process.env.TEST_PASSWORD1
    emailPage = new EmailPage(page)
    passwordPage = new PasswordPage(page)
    await page.goto(baseUrl)
    await page.getByText('Login with Cognito').click()
    await emailPage.EmailInput(email)
    await emailPage.clickNextButton()
    await passwordPage.PasswordInput(password)
    await passwordPage.clickContinue() 
    await expect(page.getByText('Access Token')).toBeVisible()
    // Extract ID token from page
    await page.waitForTimeout(2000) // Wait for token to appear
    const tokenText = await page.locator('#id-token').textContent() // Token starts with eyJ
    idToken = tokenText.trim()
    
})  
    


test('Create item via API', async () => {
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
            'Authorization': idToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'First Test item from Playwright',
            description: 'Automated API test'
        })
    });
    
    expect(response.status).toBe(201)
    
    const data = await response.json()
    expect(data.title).toBe('First Test item from Playwright')
    expect(data.description).toBe('Automated API test')
    expect(data.userId).toBeDefined()
    expect(data.itemId).toBeDefined()
    
    // Save for later tests
    createdItemId = data.itemId
});

test('List items via API', async () => {
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'GET',
        headers: {
            'Authorization': idToken
        }
    });
    
    expect(response.status).toBe(200)
    
    const items = await response.json()
    expect(Array.isArray(items)).toBe(true)
    expect(items.length).toBeGreaterThan(0)
})

test('Delete item via API', async () => {
    const response = await fetch(`${API_BASE_URL}/items/${createdItemId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': idToken
        }
    })
    
    expect(response.status).toBe(204)
})