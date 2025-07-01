import { test, expect } from "@playwright/test";

test.describe("Marathon Form Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Agregar Carrera" }).click();
  });

  test("should display all form fields", async ({ page }) => {
    await expect(page.getByLabel("Nombre")).toBeVisible();
    await expect(page.getByLabel("Fecha")).toBeVisible();
    await expect(page.getByLabel("Ubicación")).toBeVisible();
    await expect(page.getByLabel("Organizador")).toBeVisible();
    await expect(page.getByLabel("Enlace")).toBeVisible();
    await expect(page.getByLabel("Descripción")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Agregar Carrera" })
    ).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.getByRole("button", { name: "Agregar Carrera" }).click();

    await expect(page.getByText("El nombre es requerido")).toBeVisible();
    await expect(page.getByText("La fecha es requerida")).toBeVisible();
    await expect(page.getByText("La ubicación es requerida")).toBeVisible();
    await expect(page.getByText("El organizador es requerido")).toBeVisible();

    await page.getByLabel("Nombre").fill("Test Marathon");
    await page.getByLabel("Fecha").fill("2023-12-31");

    await page.getByRole("button", { name: "Agregar Carrera" }).click();

    await expect(page.getByText("El nombre es requerido")).not.toBeVisible();
    await expect(page.getByText("La fecha es requerida")).not.toBeVisible();
    await expect(page.getByText("La ubicación es requerida")).toBeVisible();
    await expect(page.getByText("El organizador es requerido")).toBeVisible();
  });

  test("should clear validation errors when fields are edited", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Agregar Carrera" }).click();

    await expect(page.getByText("El nombre es requerido")).toBeVisible();

    await page.getByLabel("Nombre").fill("Test Marathon");

    await expect(page.getByText("El nombre es requerido")).not.toBeVisible();
  });

  test("should submit the form successfully when all required fields are filled", async ({
    page,
  }) => {
    await page.getByLabel("Nombre").fill("Test Marathon");
    await page.getByLabel("Fecha").fill("2023-12-31");
    await page.getByLabel("Ubicación").fill("Test Location");
    await page.getByLabel("Organizador").fill("Test Organizer");

    await page.getByLabel("Enlace").fill("https://testmarathon.com");
    await page
      .getByLabel("Descripción")
      .fill("This is a test marathon description");

    await page.getByRole("button", { name: "Agregar Carrera" }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();

    await page
      .getByPlaceholder("Search marathons...")
      .fill("API Test Marathon");
    await expect(
      page.locator("tbody tr:first-child td:first-child")
    ).toHaveText("API Test Marathon");
  });
});
