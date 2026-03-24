import AllureReporter from "allure-playwright";
import { test, expect } from "../../fixtures/testFixtures";
import { AllureHelper } from "@utils/allureHelper";
import { LoginPage } from "@pages/LoginPage";

test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("@smoke @regression - successful login redirects to inventory", async ({
    loginPage,
    users,
    page,
  }) => {
    await AllureHelper.label("Authentication", "Succesfull Login", "critical");
    await AllureHelper.setDescription(
      "Standard user should be redirected to the inventory page after login",
    );
    await AllureHelper.step("Enter valid credentials", async () => {
      await loginPage.login(users.standard.username, users.standard.password);
    });
    await AllureHelper.step("Verife redirect to inventory page", async () => {
      await expect(page).toHaveURL(/.*inventory\.html/);
    });
  });

  test("@regression - locked user sees error message", async ({
    loginPage,
    users,
  }) => {
    await AllureHelper.label("Authentication", "Locked-user", "normal");

    await AllureHelper.step("Attempt login with locked account", async () => {
      await loginPage.login(users.locked.username, users.locked.password);
    });
    await AllureHelper.step("Verify error message content", async () => {
      await loginPage.assertErrorVisible();
      expect(await loginPage.getErrorMessage()).toContain("locked out");
    });
  });

  test("@regression - wrong password shows error", async ({
    loginPage,
    users,
  }) => {
    await AllureHelper.label("Authentication", "Invalid Credentials", "normal");

    await loginPage.login(users.standard.username, "wrong_password");

    await AllureHelper.step("Verify error message", async () => {
      await loginPage.assertErrorVisible();
      expect(await loginPage.getErrorMessage()).toContain(
        "Username and password do not match",
      );
    });
  });

  test("@regression - empty username shows error", async ({ loginPage }) => {
    await AllureHelper.label("Authentication", "Empty Username", "minor");

    await loginPage.login("", "secret_sauce");
    await loginPage.assertErrorVisible();
    expect(await loginPage.getErrorMessage()).toContain("Username is required");
  });

  test("@regression - empty password shows error", async ({
    loginPage,
    users,
  }) => {
    await AllureHelper.label("Authentication", "Empty Password", "minor");

    await loginPage.login(users.standard.username, "");
    await loginPage.assertErrorVisible();
    expect(await loginPage.getErrorMessage()).toContain("Password is required");
  });

  test("@regression - login page has correct elements", async ({
    loginPage,
  }) => {
    await AllureHelper.label("Authentication", "Login Page UI", "trivial");
    await loginPage.assertOnLoginPage();
  });
});
