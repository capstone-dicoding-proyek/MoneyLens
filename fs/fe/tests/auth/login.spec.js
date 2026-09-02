import { test, expect } from '@playwright/test';

test.describe('Auth Module - Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should render login card with MoneyLens branding and fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Masuk ke MoneyLens/i })).toBeVisible();
    await expect(page.getByPlaceholder('nama@email.com')).toBeVisible();
    await expect(page.getByPlaceholder(/Masukkan kata sandi/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /^Masuk$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Masuk dengan Google/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Lupa Password\?/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Daftar Sekarang/i })).toBeVisible();
  });

  test('should show error toast when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: /^Masuk$/i }).click();
    await expect(page.getByText(/Email dan password wajib diisi/i)).toBeVisible();
  });

  test('should navigate to Register page when clicking Daftar Sekarang', async ({ page }) => {
    await page.getByRole('link', { name: /Daftar Sekarang/i }).click();
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { name: /Buat Akun Baru/i })).toBeVisible();
  });

  test('should navigate to Reset Password page when clicking Lupa Password', async ({ page }) => {
    await page.getByRole('link', { name: /Lupa Password\?/i }).click();
    await expect(page).toHaveURL(/.*reset-password/);
  });
});
