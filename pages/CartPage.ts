import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator(".title");
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]',
    );
  }

  async assertOnCartPage(): Promise<void> {
    await this.assertText(this.pageTitle, "Your Cart");
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async assertItemPresent(itemName: string): Promise<void> {
    await this.assertVisible(this.cartItems.filter({ hasText: itemName }));
  }

  async removeItem(itemName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: itemName });
    await this.clickElement(item.locator('button[id^="remove"]'));
  }

  async getItemPrice(itemName: string): Promise<string> {
    const item = this.cartItems.filter({ hasText: itemName });
    return this.getText(item.locator(".inventory_item_price"));
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.clickElement(this.continueShoppingButton);
  }
}
