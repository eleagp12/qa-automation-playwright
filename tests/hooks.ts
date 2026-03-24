import { test } from "../fixtures/testFixtures";
import { AllureHelper } from "../utils/allureHelper";

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === "failed") {
    await AllureHelper.attachScreenshot(page, `FAILED — ${testInfo.title}`);

    if (testInfo.error?.message) {
      await AllureHelper.attachText("Error Message", testInfo.error.message);
    }
  }
});
