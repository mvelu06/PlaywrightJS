# Practice Test Automation - Login Tests

This folder contains automated test scripts for the Practice Test Automation website login functionality.

## Website
- **URL:** https://practicetestautomation.com/practice-test-login/
- **Purpose:** Practice site for learning test automation

## Test Credentials

| Field | Value |
|-------|-------|
| Valid Username | `student` |
| Valid Password | `Password123` |
| Invalid Username | `incorrectUser` |
| Invalid Password | `incorrectPassword` |

## Test Cases

### TC-01: Positive Login Test ✅
**Objective:** Verify successful login with valid credentials

**Steps:**
1. Navigate to login page
2. Enter username: `student`
3. Enter password: `Password123`
4. Click Submit button
5. Verify URL contains `logged-in-successfully`
6. Verify success message displays
7. Verify Logout button is visible

**Expected Result:** User successfully logs in

---

### TC-02: Negative Login Test - Invalid Username ❌
**Objective:** Verify login fails with invalid username

**Steps:**
1. Navigate to login page
2. Enter username: `incorrectUser`
3. Enter password: `Password123`
4. Click Submit button
5. Verify error message appears
6. Verify error message: "Your username is invalid!"
7. Verify still on login page

**Expected Result:** Login fails with error message

---

### TC-03: Negative Login Test - Invalid Password ❌
**Objective:** Verify login fails with invalid password

**Steps:**
1. Navigate to login page
2. Enter username: `student`
3. Enter password: `incorrectPassword`
4. Click Submit button
5. Verify error message appears
6. Verify error message: "Your password is invalid!"
7. Verify still on login page

**Expected Result:** Login fails with error message

---

### TC-04: Empty Username Test
**Objective:** Verify login fails with empty username

**Steps:**
1. Navigate to login page
2. Leave username empty
3. Enter password: `Password123`
4. Click Submit button

**Expected Result:** Validation error or stay on login page

---

### TC-05: Empty Password Test
**Objective:** Verify login fails with empty password

**Steps:**
1. Navigate to login page
2. Enter username: `student`
3. Leave password empty
4. Click Submit button

**Expected Result:** Validation error or stay on login page

---

### TC-06: Form Elements Visibility Test
**Objective:** Verify all form elements are visible

**Expected Elements:**
- Username input field ✓
- Password input field ✓
- Submit button ✓

---

### TC-07: Page Title and Heading Test
**Objective:** Verify page title and heading

**Expected:**
- Page title contains "Login"
- Page heading contains "Test login" or similar

---

### TC-08: Text Input Acceptance Test
**Objective:** Verify form fields accept text input

**Steps:**
1. Enter test username
2. Enter test password
3. Verify text was entered correctly

---

### TC-09: Form Clear Test
**Objective:** Verify form fields can be cleared

**Steps:**
1. Fill form fields
2. Clear both fields
3. Verify fields are empty

---

### TC-10: Submit Button Test
**Objective:** Verify submit button is enabled and clickable

**Expected:**
- Button is visible
- Button is enabled
- Button is clickable

---

## How to Run Tests

### Run all tests:
```bash
npm test
```

### Run login tests only:
```bash
npx playwright test tests/login.spec.js
```

### Run tests in headed mode (see browser):
```bash
npx playwright test tests/login.spec.js --headed
```

### Run tests in debug mode:
```bash
npx playwright test tests/login.spec.js --debug
```

### Run specific test:
```bash
npx playwright test --grep "Positive login test"
```

### Run on specific browser:
```bash
npx playwright test tests/login.spec.js --project=chromium
```

### View HTML report:
```bash
npm run report
```

---

## File Structure

```
Playwright_framework/
├── pages/
│   └── login.page.js          # Page Object Model for login page
├── tests/
│   └── login.spec.js          # Login test cases
├── config/
│   └── environment.js         # Environment configuration
├── .env                       # Environment variables (add to .gitignore)
├── .env.example              # Example environment variables
└── playwright.config.js       # Playwright configuration
```

---

## Page Object Model (login.page.js)

### Class: LoginPage

**Constructor:**
```javascript
constructor(page)
```

**Methods:**

#### goto()
Navigate to the login page
```javascript
await loginPage.goto();
```

#### login(username, password)
Fill username and password, then submit
```javascript
await loginPage.login('student', 'Password123');
```

#### getErrorMessage()
Get the error message if login fails
```javascript
const error = await loginPage.getErrorMessage();
```

#### isLogoutButtonVisible()
Check if logout button is visible (indicates successful login)
```javascript
const isVisible = await loginPage.isLogoutButtonVisible();
```

#### getSuccessMessage()
Get the success message after successful login
```javascript
const message = await loginPage.getSuccessMessage();
```

#### getCurrentUrl()
Get the current page URL
```javascript
const url = await loginPage.getCurrentUrl();
```

---

## Key Locators

| Element | Selector |
|---------|----------|
| Username Field | `#username` |
| Password Field | `#password` |
| Submit Button | `#submit` |
| Error Message | `[class*="error"]` |
| Logout Button | `a:has-text("Log out")` |
| Success Message | `h1, h2, p` containing "Congratulations" |

---

## Configuration

### Environment Variables (.env)
```env
BASE_URL=https://practicetestautomation.com/practice-test-login/
TEST_USER=student
TEST_PASS=Password123
```

### Playwright Config
- **Timeout:** 30 seconds
- **Expect Timeout:** 5 seconds
- **Browsers:** Chromium, Firefox, WebKit
- **Reports:** HTML report
- **Screenshots:** On failure
- **Video:** On failure
- **Trace:** On first retry

---

## Troubleshooting

### Tests are timing out
- Check internet connection
- Increase timeout in playwright.config.js
- Run in headed mode to see what's happening

### Elements not found
- Run in headed mode with `--headed` flag
- Check if locators are correct
- Inspect page with browser DevTools

### Tests fail intermittently
- Use proper waits instead of hardcoded delays
- Check for network delays
- Run tests in debug mode

---

## Best Practices Used

✅ **Page Object Model** - Locators and methods in separate page classes
✅ **Test Data Centralization** - Credentials stored in .env file
✅ **Descriptive Test Names** - Clear naming convention (TC-XX format)
✅ **Proper Waits** - Using Playwright's built-in waits
✅ **Error Handling** - Proper exception handling in helper methods
✅ **Screenshot on Failure** - Configured in playwright.config.js
✅ **HTML Reports** - Visual test reports
✅ **Reusable Methods** - DRY principle applied

---

## Resources

- [Practice Test Automation Website](https://practicetestautomation.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

---

**Version:** 1.0
**Last Updated:** June 2024
