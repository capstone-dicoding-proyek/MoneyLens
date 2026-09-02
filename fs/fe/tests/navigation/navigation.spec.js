import { test, expect } from '@playwright/test';

test.describe('Navigation Module', () => {
  test('should load application and navigate between guest auth views', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Masuk ke MoneyLens/i })).toBeVisible();

    // Navigate to register
    await page.getByRole('link', { name: /Daftar Sekarang/i }).click();
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { name: /Buat Akun Baru/i })).toBeVisible();

    // Navigate back to login
    await page.getByRole('link', { name: /Masuk ke Akun/i }).click();
    await expect(page).toHaveURL(/.*login/);

    // Navigate to reset password
    await page.getByRole('link', { name: /Lupa Password\?/i }).click();
    await expect(page).toHaveURL(/.*reset-password/);
  });

  test('should render 404 page and return home on click', async ({ page }) => {
    await page.goto('/non-existent-page-xyz');
    await expect(page.getByText('404')).toBeVisible();

    await page.getByRole('link', { name: /Kembali ke Beranda/i }).click();
    // Redirects to root which for guest is login
    await expect(page).toHaveURL(/.*login|\//);
  });
});
