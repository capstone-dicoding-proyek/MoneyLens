import { test, expect } from '@playwright/test';

test.describe('Dashboard Module - Dashboard Page', () => {
  test('should redirect unauthenticated users to login page', async ({ page }) => {
    await page.goto('/');
    // When not logged in, should redirect to /login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: /Masuk ke MoneyLens/i })).toBeVisible();
  });

  test('should render 404 page for unknown routes with home link', async ({ page }) => {
    await page.goto('/unknown-random-route');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Halaman Tidak Ditemukan/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Kembali ke Beranda/i })).toBeVisible();
  });
});
