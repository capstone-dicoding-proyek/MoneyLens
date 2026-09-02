import { test, expect } from '@playwright/test';

test.describe('Auth Module - Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should render registration form with password criteria guidance', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Buat Akun Baru/i })).toBeVisible();
    await expect(page.getByPlaceholder('John Doe')).toBeVisible();
    await expect(page.getByPlaceholder('nama@email.com')).toBeVisible();
    await expect(page.getByPlaceholder('Minimal 8 karakter')).toBeVisible();
    await expect(page.getByPlaceholder('Ketik ulang password...')).toBeVisible();
    await expect(page.getByText('Kriteria Password:')).toBeVisible();
    await expect(page.getByRole('button', { name: /Daftar Sekarang/i })).toBeVisible();
  });

  test('should show validation error when submitting with empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /Daftar Sekarang/i }).click();
    await expect(page.getByText(/Nama lengkap tidak boleh kosong/i)).toBeVisible();
  });

  test('should show validation error when passwords do not match', async ({ page }) => {
    await page.getByPlaceholder('John Doe').fill('Budi Setiawan');
    await page.getByPlaceholder('nama@email.com').fill('budi@example.com');
    await page.getByPlaceholder('Minimal 8 karakter').fill('Password123!');
    await page.getByPlaceholder('Ketik ulang password...').fill('DifferentPassword123!');

    await page.getByRole('button', { name: /Daftar Sekarang/i }).click();
    await expect(page.getByText(/Konfirmasi password tidak cocok/i)).toBeVisible();
  });

  test('should navigate back to Login page when clicking Masuk ke Akun', async ({ page }) => {
    await page.getByRole('link', { name: /Masuk ke Akun/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});
