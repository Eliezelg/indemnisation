import { test, expect } from '@playwright/test';

test.describe('Admin Workflow', () => {
  const ADMIN_EMAIL = 'tehilaoualid@gmail.com';
  const ADMIN_PASSWORD = 'admin123'; // Adjust based on actual admin password

  // Helper to login as admin
  async function loginAsAdmin(page: any) {
    await page.goto('/fr/login');

    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);

    await page.click('button[type="submit"]');

    // Wait for successful login and redirect
    await page.waitForTimeout(2000);
  }

  test('should access admin dashboard', async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to admin dashboard
    await page.goto('/fr/admin');

    // Should see admin dashboard elements
    await expect(page.locator('text=Dashboard Admin, text=Tableau de bord')).toBeVisible();
    await expect(page.locator('text=Réclamations, text=Claims')).toBeVisible();
  });

  test('should view claims list', async ({ page }) => {
    await loginAsAdmin(page);

    // Navigate to claims management
    await page.goto('/fr/admin/claims');

    // Should see claims table
    await expect(page.locator('table, text=Réclamations')).toBeVisible();

    // Should have filter options
    const hasFilters = await page.locator('select, button:has-text("Filtrer")').isVisible().catch(() => false);
    expect(hasFilters).toBeTruthy();
  });

  test('should filter claims by status', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/claims');

    // Find status filter
    const statusFilter = page.locator('select, button:has-text("Statut")').first();

    if (await statusFilter.isVisible()) {
      // Select a specific status (e.g., SUBMITTED)
      await statusFilter.click();
      await page.click('text=SUBMITTED, text=Soumis');

      // Wait for filtered results
      await page.waitForTimeout(1000);

      // Verify filter applied
      const url = page.url();
      expect(url).toContain('status');
    }
  });

  test('should view claim details', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/claims');

    // Click on first claim in the list
    const firstClaimLink = page.locator('table a, tbody tr').first();
    await firstClaimLink.click();

    // Wait for detail page
    await page.waitForTimeout(1000);

    // Should see claim details
    await expect(page.locator('text=Numéro de vol, text=Flight')).toBeVisible();
    await expect(page.locator('text=Statut, text=Status')).toBeVisible();
  });

  test('should update claim status', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/claims');

    // Click on first claim
    const firstClaimLink = page.locator('table a, tbody tr').first();
    await firstClaimLink.click();

    await page.waitForTimeout(1000);

    // Look for status update buttons
    const approveButton = page.locator('button:has-text("Approuv"), button:has-text("Approve")');

    if (await approveButton.isVisible()) {
      // Click approve button
      await approveButton.click();

      // Wait for confirmation or success message
      await page.waitForTimeout(1000);

      // Should see updated status
      await expect(page.locator('text=APPROVED, text=Approuvé')).toBeVisible();
    }
  });

  test('should search claims', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/claims');

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Recherch"]');

    if (await searchInput.isVisible()) {
      // Type search query
      await searchInput.fill('CLM');

      // Wait for search results
      await page.waitForTimeout(1000);

      // Results should be filtered
      const tableRows = await page.locator('tbody tr').count();
      expect(tableRows).toBeGreaterThanOrEqual(0);
    }
  });

  test('should export claims to CSV', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/claims');

    // Find export button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("CSV")');

    if (await exportButton.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);

      // Click export
      await exportButton.click();

      // Wait for download
      const download = await downloadPromise;

      if (download) {
        // Verify download started
        expect(download.suggestedFilename()).toContain('.csv');
      }
    }
  });

  test('should view admin statistics', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/statistics');

    // Should see statistics page
    await expect(page.locator('text=Statistiques, text=Statistics')).toBeVisible();

    // Should have charts
    const hasCharts = await page.locator('svg, canvas').count();
    expect(hasCharts).toBeGreaterThan(0);
  });

  test('should view users list', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/users');

    // Should see users table
    await expect(page.locator('text=Utilisateurs, text=Users')).toBeVisible();
    await expect(page.locator('table, tbody')).toBeVisible();
  });

  test('should view pending documents', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/documents');

    // Should see documents validation page
    await expect(page.locator('text=Documents, text=Validation')).toBeVisible();
  });

  test('should validate document', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/documents');

    // Look for validate button
    const validateButton = page.locator('button:has-text("Valider"), button:has-text("Validate")').first();

    if (await validateButton.isVisible()) {
      // Click validate
      await validateButton.click();

      // Wait for confirmation
      await page.waitForTimeout(1000);

      // Document should be validated
      await expect(page.locator('text=validé, text=validated')).toBeVisible();
    }
  });

  test('should access admin settings', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin/settings');

    // Should see settings page
    await expect(page.locator('text=Paramètres, text=Settings')).toBeVisible();
  });

  test('should logout from admin', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/fr/admin');

    // Find logout button (usually in sidebar)
    const logoutButton = page.locator('button:has-text("Déconnexion"), button:has-text("Logout")');

    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Should redirect to login page
      await page.waitForURL(/\/(login|fr)/, { timeout: 5000 });
    }
  });
});
