import { test, expect } from "@playwright/test";

test.describe("Runtrack", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the main page with marathon list", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Runtrack");

    await expect(page.locator("table")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Add Marathon" })
    ).toBeVisible();
  });

  test("should filter marathons by search term", async ({ page }) => {
    await page.getByPlaceholder("Search marathons...").fill("Boston");

    await expect(
      page.locator("tbody tr:first-child td:first-child")
    ).toHaveText("Maratón de Boston");

    await page.getByPlaceholder("Search marathons...").clear();
  });

  test("should open the add marathon form", async ({ page }) => {
    await page.getByRole("button", { name: "Add Marathon" }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog").locator("h2")).toHaveText(
      "Add New Marathon"
    );

    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Date")).toBeVisible();
    await expect(page.getByLabel("Location")).toBeVisible();
    await expect(page.getByLabel("Organizer")).toBeVisible();
  });

  test("should validate required fields in the form", async ({ page }) => {
    await page.getByRole("button", { name: "Add Marathon" }).click();

    await page.getByRole("button", { name: "Add Marathon" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Date is required")).toBeVisible();
    await expect(page.getByText("Location is required")).toBeVisible();
    await expect(page.getByText("Organizer is required")).toBeVisible();
  });

  test("should add a new marathon", async ({ page }) => {
    await page.getByRole("button", { name: "Add Marathon" }).click();

    await page.getByLabel("Name").fill("API Test Marathon");
    await page.getByLabel("Date").fill("2023-12-31");
    await page.getByLabel("Location").fill("Test Location");
    await page.getByLabel("Organizer").fill("Test Organizer");
    await page.getByLabel("Description").fill("This is a test marathon");

    await page.getByRole("button", { name: "Add Marathon" }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page
      .getByPlaceholder("Search marathons...")
      .fill("API Test Marathon");
    await expect(
      page.locator("tbody tr:first-child td:first-child")
    ).toHaveText("API Test Marathon");
  });

  test("should navigate to marathon detail page", async ({ page }) => {
    await page
      .getByRole("button", { name: "View" })
      .first()
      .click({ timeout: 25000 });

    await expect(page).toHaveURL(/\/marathons\/\d+/, { timeout: 25000 });

    await expect(page.getByText(/Date:/)).toBeVisible({ timeout: 25000 });
    await expect(page.getByText(/Location:/)).toBeVisible({ timeout: 25000 });
    await expect(page.getByText(/Organizer:/)).toBeVisible({ timeout: 25000 });

    await expect(
      page.getByRole("button", { name: "Back to Marathons" })
    ).toBeVisible();
  });
});
