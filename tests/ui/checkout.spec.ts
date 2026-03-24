import { test, expect } from "../../fixtures/testFixtures";
import { AllureHelper } from "../../utils/allureHelper";
import { InventoryPage, CartPage, CheckoutPage } from "../../pages";

test.describe("Checkout Flow", () => {
  test("@smoke @regression - complete checkout flow end to end", async ({
    authenticatedPage,
    products,
    checkoutData,
  }) => {
    // blocker = if this fails, nothing else matters
    await AllureHelper.label("Checkout", "Complete Purchase Flow", "blocker");
    await AllureHelper.setDescription(
      "Verifies the entire purchase journey from product selection to order confirmation",
    );

    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);

    await AllureHelper.step("Add product to cart", async () => {
      await inventoryPage.addProductToCart(products[0].name);
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });

    await AllureHelper.step("Navigate to cart and verify item", async () => {
      await inventoryPage.goToCart();
      await cartPage.assertOnCartPage();
      await cartPage.assertItemPresent(products[0].name);
    });

    await AllureHelper.step("Begin checkout process", async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.assertOnStepOne();
    });

    await AllureHelper.step("Fill in customer information", async () => {
      await checkoutPage.fillInfo(checkoutData.valid);
      await checkoutPage.clickContinue();
    });

    await AllureHelper.step("Verify order summary and price math", async () => {
      await checkoutPage.assertOnStepTwo();
      expect(await checkoutPage.getSummaryItemCount()).toBe(1);

      const { subtotal, tax, total } = await checkoutPage.getPrices();
      expect(total).toBeCloseTo(subtotal + tax, 2);
    });

    await AllureHelper.step("Complete order and confirm", async () => {
      await checkoutPage.clickFinish();
      await checkoutPage.assertOrderConfirmed();
    });

    // Attach a screenshot of the confirmation page to the report
    await AllureHelper.attachScreenshot(
      authenticatedPage,
      "Order Confirmation",
    );
  });

  test("@regression - missing first name blocks checkout", async ({
    authenticatedPage,
    products,
    checkoutData,
  }) => {
    await AllureHelper.label("Checkout", "Checkout Validation", "normal");

    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);

    await AllureHelper.step("Reach checkout step one", async () => {
      await inventoryPage.addProductToCart(products[0].name);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    await AllureHelper.step("Submit form with missing first name", async () => {
      await checkoutPage.fillInfo(checkoutData.invalid);
      await checkoutPage.clickContinue();
    });

    await AllureHelper.step("Verify validation error is shown", async () => {
      await checkoutPage.assertOnStepOne();
      expect(await checkoutPage.getErrorMessage()).toContain(
        "First Name is required",
      );
    });
  });
});
