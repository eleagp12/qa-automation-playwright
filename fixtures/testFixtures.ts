import { test as base, Page } from "@playwright/test";
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from "../pages";
import usersData from "./users.json";
import productsData from "./products.json";

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

type DataFixtures = {
  users: typeof usersData.users;
  products: typeof productsData.products;
  checkoutData: typeof productsData.checkout;
};

type StateFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<PageFixtures & DataFixtures & StateFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  users: async ({}, use) => {
    await use(usersData.users);
  },

  products: async ({}, use) => {
    await use(productsData.products);
  },

  checkoutData: async ({}, use) => {
    await use(productsData.checkout);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      usersData.users.standard.username,
      usersData.users.standard.password,
    );

    await page.waitForURL("**/inventory.html");

    await use(page);
  },
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach("screenshot on failure", {
      body: screenshot,
      contentType: "image/png",
    });
  }
});

export { expect } from "@playwright/test";
