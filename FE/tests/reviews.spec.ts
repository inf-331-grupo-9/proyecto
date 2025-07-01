import { test, expect } from '@playwright/test';

test.describe('Review System', () => {
  test('should display review section on marathon detail page', async ({ page }) => {
    // First, go to the main page to get a marathon ID
    await page.goto('/');
    await page.waitForSelector('table');
    
    // Click on the first marathon's view button
    const viewButton = page.locator('button[aria-label="View"]').first();
    await viewButton.click();
    
    // Check if we're on a detail page
    await page.waitForURL(/\/marathons\/id\//);
    
    // Check if review section is displayed
    const reviewSection = page.locator('h3:has-text("Reviews")');
    await expect(reviewSection).toBeVisible();
    
    // Check if write review button is present
    const writeReviewButton = page.locator('button:has-text("Write a Review")');
    await expect(writeReviewButton).toBeVisible();
  });

  test('should allow writing a review', async ({ page }) => {
    // Go to a marathon detail page
    await page.goto('/');
    await page.waitForSelector('table');
    const viewButton = page.locator('button[aria-label="View"]').first();
    await viewButton.click();
    await page.waitForURL(/\/marathons\/id\//);
    
    // Click write review button
    const writeReviewButton = page.locator('button:has-text("Write a Review")');
    await writeReviewButton.click();
    
    // Check if textarea appears
    const textarea = page.locator('textarea[placeholder*="Share your experience"]');
    await expect(textarea).toBeVisible();
    
    // Type a review
    await textarea.fill('This was an amazing marathon experience!');
    
    // Submit the review
    const submitButton = page.locator('button:has-text("Post Review")');
    await submitButton.click();
    
    // Check if review appears in the list
    const reviewText = page.locator('text=This was an amazing marathon experience!');
    await expect(reviewText).toBeVisible();
  });

  test('should show character count and limit', async ({ page }) => {
    // Go to a marathon detail page
    await page.goto('/');
    await page.waitForSelector('table');
    const viewButton = page.locator('button[aria-label="View"]').first();
    await viewButton.click();
    await page.waitForURL(/\/marathons\/id\//);
    
    // Click write review button
    const writeReviewButton = page.locator('button:has-text("Write a Review")');
    await writeReviewButton.click();
    
    // Check if character count is displayed
    const charCount = page.locator('text=/\\d+\\/500 characters/');
    await expect(charCount).toBeVisible();
    
    // Type a long review to test the limit
    const textarea = page.locator('textarea[placeholder*="Share your experience"]');
    const longText = 'A'.repeat(501);
    await textarea.fill(longText);
    
    // Check that the text is truncated to 500 characters
    const textareaValue = await textarea.inputValue();
    expect(textareaValue.length).toBeLessThanOrEqual(500);
  });

  test('should allow editing and deleting reviews', async ({ page }) => {
    // Go to a marathon detail page
    await page.goto('/');
    await page.waitForSelector('table');
    const viewButton = page.locator('button[aria-label="View"]').first();
    await viewButton.click();
    await page.waitForURL(/\/marathons\/id\//);
    
    // Write a review first
    const writeReviewButton = page.locator('button:has-text("Write a Review")');
    await writeReviewButton.click();
    
    const textarea = page.locator('textarea[placeholder*="Share your experience"]');
    await textarea.fill('Original review');
    
    const submitButton = page.locator('button:has-text("Post Review")');
    await submitButton.click();
    
    // Check if edit and delete buttons appear
    const editButton = page.locator('button[aria-label="Edit"]');
    const deleteButton = page.locator('button[aria-label="Delete"]');
    await expect(editButton).toBeVisible();
    await expect(deleteButton).toBeVisible();
    
    // Test editing
    await editButton.click();
    await textarea.fill('Updated review');
    const updateButton = page.locator('button:has-text("Update Review")');
    await updateButton.click();
    
    // Check if updated review appears
    const updatedText = page.locator('text=Updated review');
    await expect(updatedText).toBeVisible();
  });
}); 