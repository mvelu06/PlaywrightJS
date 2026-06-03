class LoginPage {
  constructor(page) {
    this.page = page;
    // Locators for practicetestautomation.com login form
    this.username = page.locator('#username');
    this.password = page.locator('#password');
    this.submit = page.locator('#submit');
    this.errorMessage = page.locator('[class*="error"]');
    this.logoutButton = page.locator('a:has-text("Log out")');
    this.successMessage = page.locator('h1, h2, p:has-text("Congratulations"), p:has-text("successfully logged in")');
  }

  async goto() {
    const url = process.env.BASE_URL || 'https://practicetestautomation.com/practice-test-login/';
    await this.page.goto(url);
  }

  async login(user, pass) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
    // Wait for navigation
    await this.page.waitForURL(/logged-in-successfully|practice-test-login/, { waitUntil: 'networkidle' }).catch(() => {});
  }

  async getErrorMessage() {
    try {
      await this.errorMessage.waitFor({ timeout: 5000 });
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  async isLogoutButtonVisible() {
    try {
      return await this.logoutButton.isVisible({ timeout: 3000 });
    } catch {
      return false;
    }
  }

  async getSuccessMessage() {
    try {
      await this.successMessage.waitFor({ timeout: 5000 });
      return await this.successMessage.textContent();
    } catch {
      return null;
    }
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = { LoginPage };
