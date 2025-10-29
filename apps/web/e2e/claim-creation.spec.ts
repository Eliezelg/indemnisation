import { test, expect } from '@playwright/test';

test.describe('Claim Creation Flow', () => {
  // Helper function to register a new user
  async function registerUser(page: any, email: string) {
    await page.goto('/fr/register');

    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="phone"]', '+33612345678');

    await page.click('button[type="submit"]');

    // Wait for redirect or success message
    await page.waitForURL(/\/fr\/(login|dashboard)/, { timeout: 10000 });
  }

  // Helper function to login
  async function loginUser(page: any, email: string, password: string) {
    await page.goto('/fr/login');

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard or home
    await page.waitForURL(/\/fr\/(dashboard|claims)/, { timeout: 10000 });
  }

  test('should complete full claim creation flow', async ({ page }) => {
    // Generate unique email
    const uniqueEmail = `test.${Date.now()}@example.com`;

    // Step 1: Register new user
    await registerUser(page, uniqueEmail);

    // Step 2: Login (if not already logged in)
    const isLoginPage = page.url().includes('/login');
    if (isLoginPage) {
      await loginUser(page, uniqueEmail, 'Password123!');
    }

    // Step 3: Navigate to new claim form
    await page.goto('/fr/claims/new');

    // Step 4: Fill flight information
    await page.fill('input[name="flightNumber"]', 'AF123');
    await page.fill('input[name="flightDate"]', '2025-11-15');

    // Step 5: Select departure airport using autocomplete
    const departureInput = page.locator('input[placeholder*="Rechercher"]').first();
    await departureInput.fill('paris');
    await page.waitForSelector('text=CDG', { timeout: 5000 });
    await page.locator('text=CDG').first().click();

    // Step 6: Select arrival airport using autocomplete
    const arrivalInput = page.locator('input[placeholder*="Rechercher"]').last();
    await arrivalInput.fill('tel aviv');
    await page.waitForSelector('text=TLV', { timeout: 5000 });
    await page.locator('text=TLV').last().click();

    // Step 7: Select disruption type
    await page.click('text=Retard');

    // Step 8: Enter delay minutes
    await page.fill('input[name="delayMinutes"]', '240');

    // Step 9: Click next/submit
    const nextButton = page.locator('button:has-text("Suivant"), button:has-text("Calculer")');
    await nextButton.click();

    // Step 10: Verify we moved forward or see results
    // This depends on your form structure - adjust as needed
    await page.waitForTimeout(2000);

    // Verify no errors appeared
    const hasFormError = await page.locator('text=erreur, text=Erreur').isVisible().catch(() => false);
    expect(hasFormError).toBe(false);
  });

  test('should validate required fields', async ({ page }) => {
    // Login with existing user (or skip this test if no auth)
    await page.goto('/fr/claims/new');

    // Try to submit without filling anything
    const submitButton = page.locator('button[type="submit"], button:has-text("Suivant")');

    // Form should prevent submission or show validation errors
    // This test structure depends on your validation implementation
  });

  test('should auto-search flight info after entering flight number', async ({ page }) => {
    await page.goto('/fr/claims/new');

    // Fill flight number and date
    await page.fill('input[name="flightNumber"]', 'AF1234');
    await page.fill('input[name="flightDate"]', '2025-12-01');

    // Blur flight number field to trigger search
    await page.locator('input[name="flightNumber"]').blur();

    // Wait for API call (this might show loading state or populate airline)
    await page.waitForTimeout(2000);

    // The airline field might be auto-populated (if flight found)
    // Or show "not found" message
    // Adjust this based on your actual implementation
  });

  test('should handle navigation between form steps', async ({ page }) => {
    await page.goto('/fr/claims/new');

    // Fill first step
    await page.fill('input[name="flightNumber"]', 'LY315');
    await page.fill('input[name="flightDate"]', '2025-11-20');

    const departureInput = page.locator('input[placeholder*="Rechercher"]').first();
    await departureInput.fill('tel');
    await page.waitForSelector('text=TLV', { timeout: 5000 });
    await page.locator('text=TLV').first().click();

    const arrivalInput = page.locator('input[placeholder*="Rechercher"]').last();
    await arrivalInput.fill('paris');
    await page.waitForSelector('text=CDG', { timeout: 5000 });
    await page.locator('text=CDG').last().click();

    // Click next
    await page.click('button:has-text("Suivant")');

    // Should be on step 2 (disruption)
    await expect(page.locator('text=Type de perturbation')).toBeVisible();

    // Select disruption
    await page.click('text=Annulation');

    // Click next
    await page.click('button:has-text("Suivant")');

    // Should be on step 3 (passenger info)
    // This depends on your multi-step form implementation
  });
});
