import { test, expect } from "../../fixtures/testFixtures";
import { InventoryPage, CartPage } from "../../pages";

test.describe("Add to Cart", () => {
  test("@smoke @regression - adding one item updates badge to 1", async ({
    authenticatedPage,
    products,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    await inventoryPage.addProductToCart(products[0].name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test("@regression - adding three items updates badge to 3", async ({
    authenticatedPage,
    products,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    for (let i = 0; i < 3; i++) {
      await inventoryPage.addProductToCart(products[i].name);
    }

    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
  });

  test("@regression - removing item from inventory page clears badge", async ({
    authenticatedPage,
    products,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const product = products[0];

    await inventoryPage.addProductToCart(product.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    await inventoryPage.removeProductFromCart(product.name);

    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test("@smoke @regression - cart page shows added item", async ({
    authenticatedPage,
    products,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const product = products[0];

    await inventoryPage.addProductToCart(product.name);

    await inventoryPage.goToCart();

    await cartPage.assertOnCartPage();
    await cartPage.assertItemPresent(product.name);
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test("@regression - removing item from cart page empties cart", async ({
    authenticatedPage,
    products,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const product = products[0];

    // Arrange
    await inventoryPage.addProductToCart(product.name);
    await inventoryPage.goToCart();

    // Act
    await cartPage.removeItem(product.name);

    // Assert
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test("@regression - cart price matches inventory price", async ({
    authenticatedPage,
    products,
  }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const product = products[0];

    const inventoryPrice = await inventoryPage.getProductPrice(product.name);

    await inventoryPage.addProductToCart(product.name);
    await inventoryPage.goToCart();

    const cartPrice = await cartPage.getItemPrice(product.name);
    expect(cartPrice).toBe(inventoryPrice);
  });
});
