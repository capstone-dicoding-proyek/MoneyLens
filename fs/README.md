# 🚀 MoneyLens - Full Stack Monorepo (`fs/`)

> Direktori utama untuk komponen **Frontend** dan **Backend** aplikasi pencatatan keuangan pintar **MoneyLens**.

---

## 📂 Struktur Direktori

```
fs/
├── be/        # Backend API Service (Express 5, PostgreSQL, Redis, Vitest)
└── fe/        # Frontend Web Application (React 19, Vite, TanStack Router, Playwright)
```

---

## 📖 Dokumentasi Lengkap per Modul

Untuk panduan mendalam, konfigurasi, dan daftar endpoint masing-masing komponen:
- 🏦 **[Backend API Service Documentation](be/README.md)**
- 📱 **[Frontend Web Application Documentation](fe/README.md)**

---

## ⚡ Panduan Cepat Sparse Checkout & Menjalankan

### 1. Clone Direktori `fs` Saja
```bash
git clone --filter=blob:none --no-checkout https://github.com/capstone-dicoding-proyek/MoneyLens.git
cd MoneyLens
git sparse-checkout init --cone
git sparse-checkout set fs
git checkout main
```

### 2. Menjalankan Backend (`fs/be`)
```bash
cd fs/be
npm install
npm run migrate:up
npm run dev
# Berjalan di http://localhost:5000
```

### 3. Menjalankan Frontend (`fs/fe`)
```bash
cd fs/fe
npm install
npm run dev
# Berjalan di http://localhost:5173
```

---

## 🧪 Menjalankan Seluruh Testing

### Dari Root Monorepo:
```bash
# Menjalankan seluruh test backend dan frontend
npm test

# Menjalankan linting backend dan frontend
npm run lint
```

### Secara Terpisah:
```bash
# Backend Vitest Integration Tests
npm --prefix fs/be test

# Frontend Playwright E2E Tests
npm --prefix fs/fe test
```
