import { test, expect } from '@playwright/test';

test.describe('Flight Number Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the new claim page
    await page.goto('/fr/claims/new');
  });

  test('should accept valid IATA flight number format', async ({ page }) => {
    // Find flight number input
    const flightInput = page.locator('input[name="flightNumber"]');

    // Test various valid formats
    const validFlightNumbers = ['AF123', 'LY3456', 'BA1', 'EK9999'];

    for (const flightNumber of validFlightNumbers) {
      await flightInput.fill(flightNumber);

      // Should not show error
      const hasError = await page.locator('text=Format invalide').isVisible().catch(() => false);
      expect(hasError).toBe(false);
    }
  });

  test('should reject invalid flight number formats', async ({ page }) => {
    // Find flight number input
    const flightInput = page.locator('input[name="flightNumber"]');

    // Test invalid formats
    const invalidFlightNumbers = [
      'A123',      // Only 1 letter
      'ABC123',    // 3 letters
      '123',       // No letters
      'AF',        // No digits
      'AF12345',   // Too many digits (max 4)
    ];

    for (const flightNumber of invalidFlightNumbers) {
      await flightInput.fill(flightNumber);

      // Blur to trigger validation
      await flightInput.blur();

      // Should show error message
      const hasError = await page.locator('text=Format invalide').isVisible().catch(() => false);
      expect(hasError).toBe(true);
    }
  });

  test('should auto-format flight number to uppercase', async ({ page }) => {
    // Find flight number input
    const flightInput = page.locator('input[name="flightNumber"]');

    // Type lowercase
    await flightInput.fill('af123');

    // Should be converted to uppercase
    await expect(flightInput).toHaveValue('AF123');
  });

  test('should remove spaces from flight number', async ({ page }) => {
    // Find flight number input
    const flightInput = page.locator('input[name="flightNumber"]');

    // Type with spaces
    await flightInput.fill('AF 123');

    // Should remove spaces
    const value = await flightInput.inputValue();
    expect(value).toBe('AF123');
  });

  test('should show helpful error message', async ({ page }) => {
    // Find flight number input
    const flightInput = page.locator('input[name="flightNumber"]');

    // Type invalid format
    await flightInput.fill('INVALID');
    await flightInput.blur();

    // Should show error with example
    const errorText = await page.locator('text=Format invalide').textContent();
    expect(errorText).toContain('AF123');
  });

  test('should clear error when valid input is entered', async ({ page }) => {
    // Find flight number input
    const flightInput = page.locator('input[name="flightNumber"]');

    // First, enter invalid
    await flightInput.fill('INVALID');
    await flightInput.blur();

    // Error should be visible
    await expect(page.locator('text=Format invalide')).toBeVisible();

    // Now enter valid
    await flightInput.fill('AF123');

    // Error should disappear
    const hasError = await page.locator('text=Format invalide').isVisible().catch(() => false);
    expect(hasError).toBe(false);
  });

  test('should allow 1 to 4 digits', async ({ page }) => {
    // Find flight number input
    const flightInput = page.locator('input[name="flightNumber"]');

    // Test different digit lengths
    const testCases = [
      { input: 'AF1', valid: true },
      { input: 'AF12', valid: true },
      { input: 'AF123', valid: true },
      { input: 'AF1234', valid: true },
      { input: 'AF12345', valid: false }, // Too many
    ];

    for (const { input, valid } of testCases) {
      await flightInput.fill(input);
      await flightInput.blur();

      const hasError = await page.locator('text=Format invalide').isVisible().catch(() => false);
      expect(hasError).toBe(!valid);
    }
  });
});
