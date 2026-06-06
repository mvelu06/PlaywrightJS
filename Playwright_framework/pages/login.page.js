class LoginPage {
  constructor(page) {
    this.page = page;
    // Locators for practicetestautomation.com login form
    this.username = page.locator('#username');
    this.password = page.locator('#password');
    this.submit = page.locator('#submit');
    this.errorMessage = page.locator(':has-text("is invalid")');
    this.logoutButton = page.locator('a:has-text("Log out")');
    this.successMessage = page.locator('strong:has-text("Congratulations")');
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
      const element = this.errorMessage;
      await element.waitFor({ state: 'visible', timeout: 5000 });
      const text = await element.innerText();
      return text?.trim() || null;
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
      const text = await this.successMessage.textContent();
      return text?.trim() || null;
    } catch {
      return null;
    }
  }

  async getCurrentUrl() {
    return this.page.url();
  }
}

module.exports = { LoginPage };
