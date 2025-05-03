import { test, expect } from "@playwright/test";

test.describe("Marathon Form Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Add Marathon" }).click();
  });

  test("should display all form fields", async ({ page }) => {
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Date")).toBeVisible();
    await expect(page.getByLabel("Location")).toBeVisible();
    await expect(page.getByLabel("Organizer")).toBeVisible();
    await expect(page.getByLabel("Link")).toBeVisible();
    await expect(page.getByLabel("Description")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add Marathon" })
    ).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.getByRole("button", { name: "Add Marathon" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Date is required")).toBeVisible();
    await expect(page.getByText("Location is required")).toBeVisible();
    await expect(page.getByText("Organizer is required")).toBeVisible();

    await page.getByLabel("Name").fill("Test Marathon");
    await page.getByLabel("Date").fill("2023-12-31");

    await page.getByRole("button", { name: "Add Marathon" }).click();

    await expect(page.getByText("Name is required")).not.toBeVisible();
    await expect(page.getByText("Date is required")).not.toBeVisible();
    await expect(page.getByText("Location is required")).toBeVisible();
    await expect(page.getByText("Organizer is required")).toBeVisible();
  });

  test("should clear validation errors when fields are edited", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Marathon" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();

    await page.getByLabel("Name").fill("Test Marathon");

    await expect(page.getByText("Name is required")).not.toBeVisible();
  });

  test("should submit the form successfully when all required fields are filled", async ({
    page,
  }) => {
    await page.getByLabel("Name").fill("Test Marathon");
    await page.getByLabel("Date").fill("2023-12-31");
    await page.getByLabel("Location").fill("Test Location");
    await page.getByLabel("Organizer").fill("Test Organizer");

    await page.getByLabel("Link").fill("https://testmarathon.com");
    await page
      .getByLabel("Description")
      .fill("This is a test marathon description");

    await page.getByRole("button", { name: "Add Marathon" }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page
      .getByPlaceholder("Search marathons...")
      .fill("API Test Marathon");
    await expect(
      page.locator("tbody tr:first-child td:first-child")
    ).toHaveText("API Test Marathon");
  });
});
