# Cognito Auth Test Automation

Automated UI and API testing for AWS Cognito authentication flows using Playwright and a serverless AWS backend.

## Overview

This project demonstrates comprehensive test automation for AWS Cognito authentication, covering both UI interactions and API endpoints. Built as a portfolio project to showcase proficiency in test automation, cloud architecture, and modern development practices.

The test suite validates core authentication flows including login, logout, signup, and password reset functionality. Tests are implemented using the Page Object Model pattern for maintainability and run in a CI/CD pipeline via GitHub Actions.

After 11 years in Manual QA, I built this project to master the intersection of Cloud Infrastructure and Test Automation. It represents a shift from testing 'what' is built to understanding 'how' it's built.

**Key Features:**
- UI tests using Playwright with Page Object Model architecture
- API tests for CRUD operations (POST, GET, PUT, DELETE)
- Serverless AWS backend (DynamoDB, Lambda, API Gateway)
- Cognito-based authentication and authorization
- Automated CI/CD pipeline with GitHub Actions
- User isolation testing to ensure data security

**Testing Strategy**
- Risk-Based Testing: Prioritizing critical authentication paths (Login/MFA) that impact 100% of users.
- Security-First Automation: Validating User Isolation at the API layer to ensure User A cannot access or modify User B's data (IDOR protection).
- Resilient Locators: Utilizing user-facing attributes (Roles, Labels) and strategic CSS selectors to minimize test flakiness against Cognito’s dynamic UI.

## Tech Stack

**Frontend Testing:**
- Playwright (JavaScript)
- Page Object Model pattern

**Backend:**
- AWS Lambda (Node.js)
- Amazon DynamoDB
- API Gateway (REST API with Cognito Authorizer)
- Amazon Cognito (User Pools)

**DevOps:**
- GitHub Actions
- dotenv for environment configuration

## Architecture

The application consists of two main components:

**1. UI Layer:**
- Simple web interface for Cognito authentication flows
- Tested using Playwright with Page Object Model pattern
- Tests run across Chromium and WebKit browsers

**2. Serverless Backend:**
- **DynamoDB:** NoSQL data store utilizing a Partition Key (userId) to enforce data sharding and efficient lookups for authenticated sessions
- **Lambda Functions:** Handle CRUD operations with Node.js runtime
- **API Gateway:** REST API with Cognito Authorizer for secured endpoints
- **Cognito User Pool:** Manages user authentication and authorization

Authentication flow:
1. User authenticates via Cognito
2. Receives ID token
3. API Gateway validates token using Cognito Authorizer
4. Lambda executes business logic
5. DynamoDB stores/retrieves data

## Prerequisites

- Node.js (v14 or higher)
- AWS Account with configured credentials
- Git

## Setup Instructions

1. **Clone the repository:**
```bash
   git clone https://github.com/MC11-projects/cognito-auth-testing.git
   cd cognito-auth-testing
```
2. **Docker Setup:**
```bash
   # Build the image
   docker build -t p1-app . 

   # Run the container with your .env secrets
   docker run -d -p 3000:3000 --env-file .env --name p1-running p1-app
```

3. **Install dependencies:**
```bash
   npm install
```

4. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Create three test users in your Cognito User Pool
   - Update `.env` with your test user credentials and API endpoints:
```
     TEST_EMAIL1=your-user1@example.com
     TEST_PASSWORD1=YourPassword123!
     TEST_EMAIL2=your-user2@example.com
     TEST_PASSWORD2=YourPassword123!
     TEST_EMAIL3=your-user3@example.com
     TEST_PASSWORD3=YourPassword123!
     BASE_URL=http://localhost:3000
     API_BASE_URL=https://your-api-id.execute-api.region.amazonaws.com/prod
```

5. **AWS Setup:**
   - Create a Cognito User Pool
   - Set up API Gateway with Cognito Authorizer
   - Deploy Lambda functions
   - Create DynamoDB table
   - Configure IAM roles and permissions

## Running Tests

**Run all tests:**
```bash
npx playwright test
```

**Run UI tests only:**
```bash
npx playwright test tests/ui/
```

**Run API tests only:**
```bash
npx playwright test tests/api/
```

**Run tests in headed mode:**
```bash
npx playwright test --headed
```

**View test report:**
```bash
npx playwright show-report
```

## CI/CD

The project uses GitHub Actions for continuous integration. On every push and pull request:
- Tests run across Chromium and WebKit browsers
- API tests validate all CRUD operations
- User isolation tests ensure data security

Configuration: `.github/workflows/playwright.yml`

## Project Structure
```
├── tests/
│   ├── api/           # API endpoint tests
│   ├── ui/            # UI authentication tests
│   └── pages/         # Page Object Model classes
├── .env.example       # Environment variables template
├── .gitignore
├── package.json
└── playwright.config.js
```

## Future Improvements

- **Performance Testing:** Add JMeter tests to validate API performance under load
- **Email Automation:** Integrate AWS SES/SNS or Mailosaur for automated MFA/email verification testing

## Author

C.Popescu - Manual QA Engineer transitioning to Automation Testing

## License

This project is open source and available under the MIT License.