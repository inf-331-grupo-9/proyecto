import { test, expect } from '@playwright/test';

test.describe('Rating System', () => {
  test('should display rating stars in marathon table', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the marathons to load
    await page.waitForSelector('table');
    
    // Check if rating column exists
    const ratingHeader = page.locator('th:has-text("Rating")');
    await expect(ratingHeader).toBeVisible();
    
    // Check if star rating component is present
    const starRating = page.locator('[data-testid="star-rating"]').first();
    await expect(starRating).toBeVisible();
  });

  test('should allow rating a marathon', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the marathons to load
    await page.waitForSelector('table');
    
    // Click on the rating button for the first marathon
    const ratingButton = page.locator('button[aria-label="Rate"]').first();
    await ratingButton.click();
    
    // Wait for rating dialog to open
    await page.waitForSelector('[role="dialog"]');
    
    // Click on 4 stars
    const stars = page.locator('[role="dialog"] button[type="button"]');
    await stars.nth(3).click(); // 4th star (index 3)
    
    // Submit the rating
    const submitButton = page.locator('button:has-text("Submit Rating")');
    await submitButton.click();
    
    // Wait for dialog to close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should show rating on marathon detail page', async ({ page }) => {
    // First, go to the main page to get a marathon ID
    await page.goto('/');
    await page.waitForSelector('table');
    
    // Click on the first marathon's view button
    const viewButton = page.locator('button[aria-label="View"]').first();
    await viewButton.click();
    
    // Check if we're on a detail page
    await page.waitForURL(/\/marathons\/id\//);
    
    // Check if rating is displayed
    const starRating = page.locator('[data-testid="star-rating"]');
    await expect(starRating).toBeVisible();
    
    // Check if rating button is present
    const rateButton = page.locator('button:has-text("Rate this marathon")');
    await expect(rateButton).toBeVisible();
  });
}); 