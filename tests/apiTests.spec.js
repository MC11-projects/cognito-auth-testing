// This file tests backend API operations (CRUD) with authenticated requests
import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'
import fs from 'fs'
import { EmailPage } from '../pages/EmailPage'
import { PasswordPage } from '../pages/PasswordPage'

// Conditional for CI which does not get the .env file, gets variables from Github secrets
if (fs.existsSync('.env')) {
    dotenv.config()
}

const API_BASE_URL = 'https://zgw5kb3ajl.execute-api.us-east-1.amazonaws.com/prod' // Add this to .env later - hardcoded currently for development, will be moved to .env for configurability

// API test data shared across tests
let idToken
let createdItemId

// POM variables that are shared across all tests, created in beforeEach and used in the tests themselves
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
    await page.waitForTimeout(2000) // Token takes time to render on page, needs timeout in order for the test to function correctly
    const tokenText = await page.locator('#id-token').textContent() // API Gateway Cognito authorizer requires ID token, not access token
    idToken = tokenText.trim() // Removes any whitespace that would break authorization
    
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
    })
    
    expect(response.status).toBe(201)
    
    const data = await response.json()
    expect(data.title).toBe('First Test item from Playwright')
    expect(data.description).toBe('Automated API test')
    expect(data.userId).toBeDefined()
    expect(data.itemId).toBeDefined()
    
    // Store itemId to verify DELETE operation in subsequent test
    createdItemId = data.itemId
})

test('List items via API', async () => {
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'GET',
        headers: {
            'Authorization': idToken
        }
    })
    
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

test('Create and update item via API', async () => {
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
            'Authorization': idToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'Second Test item from Playwright',
            description: 'Automated API test with PUT'
        })
    })
    expect(response.status).toBe(201)
    
    const data = await response.json()
    expect(data.title).toBe('Second Test item from Playwright')
    expect(data.description).toBe('Automated API test with PUT')
    expect(data.userId).toBeDefined()
    expect(data.itemId).toBeDefined()

    const update = await fetch(`${API_BASE_URL}/items/${data.itemId}`, {
        method: 'PUT',
        headers: {
            'Authorization': idToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'Updated Test item from Playwright',
            description: 'Item updated successfully'
        })
    })
    expect(update.status).toBe(200)

    const UpdatedData = await update.json()
    expect(UpdatedData.title).toBe('Updated Test item from Playwright')
    expect(UpdatedData.description).toBe('Item updated successfully')
    expect(UpdatedData.userId).toBeDefined()
    expect(UpdatedData.itemId).toBeDefined()
})

// Verifies DynamoDB stores SQL injection attempts as plain text (NoSQL database doesn't execute SQL commands)
test('Handles potential SQL injection as plain text', async () => {
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
            'Authorization': idToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: "'; DROP TABLE items; --",
            description: "Security test - SQL injection attempt"
        })
    })
    
    expect(response.status).toBe(201)
    
    const data = await response.json()
    expect(data.title).toBe("'; DROP TABLE items; --")  // Stored as plain text, not executed
})

test('User isolation - users cannot access each other\'s items', async ({browser}) => {
    // Step 1 & 2: User 1 already logged in (beforeEach), create item
    const user1Response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: { 
            'Authorization': idToken, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            title: 'User1 Items',
            description: 'User1 items are stored here'
        }),
    })
    const user1Item = await user1Response.json()
    
    // Step 3: Create NEW context for User 2 (like incognito)
    const context2 = await browser.newContext()
    const page2 = await context2.newPage()
    
    const user2 = process.env.TEST_EMAIL2
    const user2pass = process.env.TEST_PASSWORD2
    const baseUrl = process.env.BASE_URL
    emailPage = new EmailPage(page2)
    passwordPage = new PasswordPage(page2)

    await page2.goto(baseUrl)
    await page2.getByText('Login with Cognito').click()
    await emailPage.EmailInput(user2)
    await emailPage.clickNextButton()
    await passwordPage.PasswordInput(user2pass)
    await passwordPage.clickContinue()
    
    await page2.waitForTimeout(2000) 
    const tokenText = await page2.locator('#id-token').textContent() 
    const user2Token = tokenText.trim() 

    const user2Response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: { 
            'Authorization': user2Token, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            title: 'User2 Items',
            description: 'User2 items are stored here'
        }),
    })
    const user2Item = await user2Response.json()

    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'GET',
        headers: {
            'Authorization': user2Token
        }
    })
    
    expect(response.status).toBe(200)
    
    const items = await response.json()

    // Check that User 1's item is NOT in the array
    let foundUser1Title = false
    for (const item of items) {
        if (item.title === 'User1 Items') {
            foundUser1Title = true
            break
    }
}

    expect(foundUser1Title).toBe(false)
    expect(Array.isArray(items)).toBe(true)
    expect(items.length).toBeGreaterThan(0)

})

test('Handles very long title input', async () => {
    const longTitle = 'A'.repeat(10000) 
    
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
            'Authorization': idToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: longTitle,
            description: 'Long Title'
        })
    })
    expect(response.status).toBe(201)
    
    const data = await response.json()
    expect(data.title).toBe(longTitle) // Verifies no truncation - full string stored 
    expect(data.description).toBe('Long Title')
    expect(data.userId).toBeDefined()
    expect(data.itemId).toBeDefined()
})