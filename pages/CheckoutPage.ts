import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CheckoutInfo } from "../config/types";

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  readonly summaryItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  readonly confirmationHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.summaryItems = page.locator(".cart_item");
    this.subtotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
    this.finishButton = page.locator('[data-test="finish"]');

    this.confirmationHeader = page.locator(".complete-header");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async assertOnStepOne(): Promise<void> {
    await this.assertVisible(this.firstNameInput);
  }

  async fillInfo(info: CheckoutInfo): Promise<void> {
    await this.fillInput(this.firstNameInput, info.firstName);
    await this.fillInput(this.lastNameInput, info.lastName);
    await this.fillInput(this.postalCodeInput, info.postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.clickElement(this.continueButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async assertOnStepTwo(): Promise<void> {
    await this.assertVisible(this.finishButton);
  }

  async getSummaryItemCount(): Promise<number> {
    return this.summaryItems.count();
  }
  async getPrices(): Promise<{ subtotal: number; tax: number; total: number }> {
    const parse = (text: string) => parseFloat(text.replace(/[^0-9.]/g, ""));

    return {
      subtotal: parse(await this.getText(this.subtotalLabel)),
      tax: parse(await this.getText(this.taxLabel)),
      total: parse(await this.getText(this.totalLabel)),
    };
  }

  async clickFinish(): Promise<void> {
    await this.clickElement(this.finishButton);
  }

  async assertOrderConfirmed(): Promise<void> {
    await this.assertText(this.confirmationHeader, "Thank you for your order!");
  }

  async backToHome(): Promise<void> {
    await this.clickElement(this.backHomeButton);
  }
}
