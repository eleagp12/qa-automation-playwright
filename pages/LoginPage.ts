import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // Every locator is readonly, selectors don't change mid-test
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page); // Always call super() first initializes this.page in BasePage

    // data test attributes are the best selectors
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // ACTIONS, what can a user DO on this page?

  async goto(): Promise<void> {
    await this.navigate("/");
    // Wait for the form to confirm the page actually loaded
    await this.waitForElement(this.usernameInput);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  // ASSERTIONS

  async assertOnLoginPage(): Promise<void> {
    await this.assertVisible(this.usernameInput);
    await this.assertVisible(this.passwordInput);
    await this.assertVisible(this.loginButton);
  }

  async assertErrorVisible(): Promise<void> {
    await this.assertVisible(this.errorMessage);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }
}
