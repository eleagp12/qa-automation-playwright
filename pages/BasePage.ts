import { Page, Locator, expect } from "@playwright/test";
// abstract = this class cannot be instantiated directly
// It only exists to be extended by real page objects
export abstract class BasePage {
  // readonly = can be set in constructor, never changed after
  // protected = accessible in this class AND subclasses, but not outside
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = "/"): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getURL(): Promise<string> {
    return this.page.url();
  }

  // ELEMENT INTERACTIONS (All methods wait for visibility before acting)

  async waitForElement(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear(); // Always clear first — avoids appending to existing text
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) ?? ""; // ?? = return '' if null
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.selectOption(value);
  }

  // ASSERTIONS, Centralized so all pages use the same timeout

  async assertURL(expectedURL: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedURL);
  }

  async assertTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async assertText(locator: Locator, expected: string): Promise<void> {
    await expect(locator).toHaveText(expected);
  }
}
