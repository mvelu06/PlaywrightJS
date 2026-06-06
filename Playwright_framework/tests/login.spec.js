const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');

test.describe('Practice Test Automation - Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC-01: Positive login test with valid credentials', async ({ page }) => {
    // Test case 1: Valid login
    await loginPage.login('student', 'Password123');
    
    // Verify URL changed to logged-in-successfully
    const url = await loginPage.getCurrentUrl();
    expect(url).toContain('logged-in-successfully');
    
    // Verify success message is displayed
    const successMsg = await loginPage.getSuccessMessage();
    expect(successMsg).toBeTruthy();
    expect(successMsg).toMatch(/congratulations.*successfully logged in/i);
    
    // Verify logout button is displayed
    const isLogoutVisible = await loginPage.isLogoutButtonVisible();
    expect(isLogoutVisible).toBe(true);
  });

  test('TC-02: Negative login test with invalid username', async ({ page }) => {
    // Test case 2: Invalid username
    await loginPage.login('incorrectUser', 'Password123');
    
    // Verify error message is displayed
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toBeTruthy();
    expect(errorMsg).toContain('Your username is invalid!');
    
    // Verify still on login page
    const url = await loginPage.getCurrentUrl();
    expect(url).toContain('practice-test-login');
  });

  test('TC-03: Negative login test with invalid password', async ({ page }) => {
    // Test case 3: Invalid password
    await loginPage.login('student', 'incorrectPassword');
    
    // Verify error message is displayed
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toBeTruthy();
    expect(errorMsg).toContain('Your password is invalid');
    
    // Verify still on login page
    const url = await loginPage.getCurrentUrl();
    expect(url).toContain('practice-test-login');
  });

  test('TC-04: Login with empty username', async ({ page }) => {
    // Leave username empty and fill password
    await loginPage.password.fill('Password123');
    await loginPage.submit.click();
    
    // Should show validation error or stay on login page
    await page.waitForTimeout(1000);
    const url = await loginPage.getCurrentUrl();
    expect(url).toContain('practice-test-login');
  });

  test('TC-05: Login with empty password', async ({ page }) => {
    // Fill username but leave password empty
    await loginPage.username.fill('student');
    await loginPage.submit.click();
    
    // Should show validation error or stay on login page
    await page.waitForTimeout(1000);
    const url = await loginPage.getCurrentUrl();
    expect(url).toContain('practice-test-login');
  });

  test('TC-06: Verify login form elements are visible', async ({ page }) => {
    // Verify all form elements are visible
    await expect(loginPage.username).toBeVisible();
    await expect(loginPage.password).toBeVisible();
    await expect(loginPage.submit).toBeVisible();
  });

  test('TC-07: Verify page title and heading', async ({ page }) => {
    // Verify page title contains "Login"
    await expect(page).toHaveTitle(/Login|login/);
    
    // Verify page contains login heading
    const heading = page.locator('h1, h2, h3');
    await expect(heading).toContainText(/Login|Test login|login test/i);
  });

  test('TC-08: Verify form fields accept text input', async ({ page }) => {
    // Test that fields accept input
    const testUsername = 'testuser123';
    const testPassword = 'testpass456';
    
    await loginPage.username.fill(testUsername);
    await loginPage.password.fill(testPassword);
    
    // Verify the text was entered
    const usernameValue = await loginPage.username.inputValue();
    const passwordValue = await loginPage.password.inputValue();
    
    expect(usernameValue).toBe(testUsername);
    expect(passwordValue).toBe(testPassword);
  });

  test('TC-09: Verify form can be cleared', async ({ page }) => {
    // Fill form
    await loginPage.username.fill('student');
    await loginPage.password.fill('Password123');
    
    // Clear form
    await loginPage.username.clear();
    await loginPage.password.clear();
    
    // Verify fields are empty
    const usernameValue = await loginPage.username.inputValue();
    const passwordValue = await loginPage.password.inputValue();
    
    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
  });

  test('TC-10: Verify submit button is clickable', async ({ page }) => {
    // Verify submit button is enabled and clickable
    await expect(loginPage.submit).toBeEnabled();
    
    // Verify button is visible
    await expect(loginPage.submit).toBeVisible();
  });
});
