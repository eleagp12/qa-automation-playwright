import { test, expect } from "../../fixtures/testFixtures";
import { InventoryPage } from "../../pages";

test.describe("Product Search & Browsing", () => {
  // No beforeEach here authenticatedPage handles login pertest via fixture
  test("@smoke @regression - inventory page shows 6 products", async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.assertOnInventoryPage();
    expect(await inventoryPage.getProductCount()).toBe(6);
  });

  test("@regression - can find product by name", async ({
    authenticatedPage,
    products,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const target = products[0]; // Sauce Labs Backpack
    const found = await inventoryPage.findProductByName(target.name);
    expect(found).not.toBeNull();
    const price = await inventoryPage.getProductPrice(target.name);
    expect(price).toBe(target.price);
  });

  test("@regression - sort A to Z produces alphabetical order", async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.sortProducts("az");
    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort(); // spread to avoid mutating original
    expect(names).toEqual(sortedNames);
  });

  test("@regression - sort Z to A produces reverse alphabetical order", async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    await inventoryPage.sortProducts("za");
    const names = await inventoryPage.getProductNames();
    const reverseSorted = [...names].sort().reverse();
    expect(names).toEqual(reverseSorted);
  });

  test("@regression - sort price low to high is ascending", async ({
    authenticatedPage,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    await inventoryPage.sortProducts("lohi");

    const prices = await authenticatedPage
      .locator(".inventory_item_price")
      .allTextContents();

    // Convert "$9.99" → 9.99, then verify each price >= previous
    const numericPrices = prices.map((p) => parseFloat(p.replace("$", "")));
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
    }
  });

  test("@regression - clicking product name opens detail page", async ({
    authenticatedPage,
    products,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const target = products[0];

    await inventoryPage.clickProduct(target.name);

    await expect(authenticatedPage).toHaveURL(/.*inventory-item\.html/);
    await expect(
      authenticatedPage.locator(".inventory_details_name"),
    ).toHaveText(target.name);
  });
});
