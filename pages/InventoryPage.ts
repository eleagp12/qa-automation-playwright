import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { SortOption } from "../config/types";

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator(".title");
    this.inventoryItems = page.locator(".inventory_item");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
  }

  async assertOnInventoryPage(): Promise<void> {
    await this.assertVisible(this.inventoryItems.first());
    await this.assertText(this.pageTitle, "Products");
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator(".inventory_item_name").allTextContents();
  }

  async findProductByName(name: string): Promise<Locator | null> {
    const count = await this.inventoryItems.count();

    for (let i = 0; i < count; i++) {
      const item = this.inventoryItems.nth(i);
      const itemName = await item.locator(".inventory_item_name").textContent();

      if (itemName?.toLowerCase().includes(name.toLowerCase())) {
        return item;
      }
    }
    return null;
  }

  async addProductToCart(productName: string): Promise<void> {
    const item = await this.findProductByName(productName);
    if (!item) throw new Error(`Product not found: "${productName}"`);

    await this.clickElement(item.locator('button[id^="add-to-cart"]'));
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const item = await this.findProductByName(productName);
    if (!item) throw new Error(`Product not found: "${productName}"`);

    await this.clickElement(item.locator('button[id^="remove"]'));
  }

  async getProductPrice(productName: string): Promise<string> {
    const item = await this.findProductByName(productName);
    if (!item) throw new Error(`Product not found: "${productName}"`);

    return this.getText(item.locator(".inventory_item_price"));
  }

  async sortProducts(option: SortOption): Promise<void> {
    await this.selectOption(this.sortDropdown, option);
  }

  async getCartBadgeCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    return parseInt((await this.cartBadge.textContent()) ?? "0", 10);
  }

  async goToCart(): Promise<void> {
    await this.clickElement(this.cartLink);
  }

  async clickProduct(productName: string): Promise<void> {
    await this.page
      .locator(".inventory_item_name", { hasText: productName })
      .click();
  }
}
