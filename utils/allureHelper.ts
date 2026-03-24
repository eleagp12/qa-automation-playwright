import { allure } from "allure-playwright";
import { Page } from "@playwright/test";

type Severity = "blocker" | "critical" | "normal" | "minor" | "trivial";

export class AllureHelper {
  static async setFeauter(feature: string): Promise<void> {
    await allure.feature(feature);
  }

  static async setStory(story: string): Promise<void> {
    await allure.story(story);
  }

  static async setSeverity(severity: Severity): Promise<void> {
    await allure.severity(severity);
  }

  static async setDescription(description: string): Promise<void> {
    await allure.description(description);
  }

  static async label(
    feature: string,
    story: string,
    severity: Severity = "normal",
  ): Promise<void> {
    await allure.feature(feature);
    await allure.story(story);
    await allure.severity(severity);
  }

  static async step<T>(name: string, action: () => Promise<T>): Promise<T> {
    return allure.step(name, action);
  }

  static async attachScreenshot(
    page: Page,
    name = "Screenshot",
  ): Promise<void> {
    const screenshot = await page.screenshot({ fullPage: true });
    await allure.attachment(name, screenshot, "image/png");
  }

  static async attachJson(name: string, data: unknown): Promise<void> {
    const json = JSON.stringify(data, null, 2);
    await allure.attachment(name, Buffer.from(json), "application/json");
  }

  static async attachText(name: string, text: string): Promise<void> {
    await allure.attachment(name, Buffer.from(text), "text/plain");
  }

  static async linkIssue(id: string, url: string): Promise<void> {
    await allure.issue(id, url);
  }

  static async linkTestCase(id: string, url: string): Promise<void> {
    await allure.tms(id, url);
  }
}
