// tests/home.spec.ts
import { test, expect } from '@playwright/test';

test('La página de login carga correctamente', async ({ page }) => {
  await page.goto('/auth/login');
  await expect(page.getByText('Ingresar a Runtrack')).toBeVisible();
});
