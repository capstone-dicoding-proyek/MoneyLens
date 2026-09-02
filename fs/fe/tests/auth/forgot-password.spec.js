import { test, expect } from '@playwright/test';

test.describe('Auth Module - Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reset-password');
  });

  test('should render forgot password card with email field', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Lupa Password\?|Verifikasi Reset Password/i })).toBeVisible();
    await expect(page.getByPlaceholder('nama@email.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /Kirim Tautan/i })).toBeVisible();
  });

  test('should show validation error when submitting empty email', async ({ page }) => {
    await page.getByRole('button', { name: /Kirim Tautan/i }).click();
    await expect(page.getByText(/Email tidak boleh kosong/i)).toBeVisible();
  });

  test('should navigate back to Login page', async ({ page }) => {
    await page.getByRole('link', { name: /Kembali ke Login/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});
