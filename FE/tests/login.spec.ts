import { test, expect } from '@playwright/test';

test('Iniciar sesión correctamente', async ({ page }) => {
  // Ir al login
  await page.goto('/');

  // Llenar el campo de correo electrónico
  await page.getByLabel('Correo Electronico').fill('test@test.com');

  // Llenar el campo de contraseña
  await page.getByLabel('Contraseña').fill('#Abcdefg1'); // reemplaza con tu clave válida

  // Hacer clic en "Ingresar"
  await page.getByRole('button', { name: 'Ingresar' }).click();

  // Esperar que algo cambie tras login (por ejemplo: redirección o contenido nuevo)
  await expect(page).toHaveURL(/\/$/); // ajusta según ruta

  // Validar que el login fue exitoso (por ejemplo, tu nombre, botón de logout, etc.)
  await expect(page.getByPlaceholder('Search races...')).toBeVisible();
});
