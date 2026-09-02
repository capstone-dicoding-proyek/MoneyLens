import { test, expect } from '@playwright/test';

test.describe('History Module - History Page', () => {
  test('should redirect unauthenticated users to login page', async ({ page }) => {
    await page.goto('/history');
    await expect(page).toHaveURL(/.*login/);
  });
});
