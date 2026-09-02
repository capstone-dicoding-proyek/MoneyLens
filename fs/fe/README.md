# 📱 MoneyLens - Frontend Web Application

> Aplikasi antarmuka pengguna web modern untuk **MoneyLens** yang dibangun dengan **React 19**, **Vite**, **TanStack Router**, **TanStack Query**, **Tailwind CSS v4**, dan **Playwright**.

---

## 📋 Daftar Isi
- [Tech Stack](#-tech-stack)
- [Fitur Utama & UX Highlights](#-fitur-utama--ux-highlights)
- [Struktur Folder](#-struktur-folder)
- [Prasyarat](#-prasyarat)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Pengujian (Testing dengan Playwright)](#-pengujian-testing-dengan-playwright)
- [Desain Sistem & CSS Architecture](#-desain-sistem--css-architecture)
- [Environment Variables](#-environment-variables)

---

## 🚀 Tech Stack

| Komponen | Teknologi |
|---|---|
| **Core Framework** | React 19, Vite 8 |
| **Routing** | TanStack Router (`@tanstack/react-router`) |
| **Server State & Caching** | TanStack Query (`@tanstack/react-query`) |
| **Styling** | Tailwind CSS v4, PostCSS (`@apply` architecture in `style.css`) |
| **Visualisasi Data & Grafik** | Recharts (Pie & Line Analytics) |
| **Indikator Loading** | NProgress (Emerald Gradient Glow) |
| **Pengujian E2E & UI** | Playwright (`@playwright/test`) |
| **Autentikasi Klien** | Google OAuth2 (`@react-oauth/google`), Axios Interceptors |
| **Ikonografi** | React Icons (`react-icons/io5`, `react-icons/fa`, `react-icons/md`) |

---

## ✨ Fitur Utama & UX Highlights

1. ⚡ **Pencarian Mutasi dengan Debounce 1 Detik & Ikon Loading**:
   - Kolom pencarian riwayat transaksi menerapkan jeda debounce **1.000 ms**.
   - Ikon pencarian berubah menjadi animasi spinner berputar (`FaSpinner`) selama menunggu input dan mengambil data dari backend.
2. 🔄 **Top Loading Bar Terintegrasi (NProgress)**:
   - Menampilkan progres bar gradien emerald (`#1A7A5E` → `#2FA084` → `#6FCF97`) saat request jaringan aktif tanpa memblokir atau membuat layar berkedip putih.
3. 🛡️ **Pesan Error Ramah Pengguna & Elegan**:
   - Menghilangkan alert mentah dan menggantinya dengan komponen [`FormErrorAlert.jsx`](file:///d:/coding/js/MoneyLens/fs/fe/src/components/FormErrorAlert.jsx) yang memiliki kontras jelas, badge status, dan tombol dismiss.
   - Mendukung highlight error inline pada setiap kolom input.
4. 🚀 **Smooth Auth Routing**:
   - Rute terproteksi (`PrivateRoute` dan `GuestRoute`) mempertahankan rendering halaman aktif tanpa menampilkan teks `Loading...` mentah saat proses verifikasi sesi.
5. 📊 **Dashboard Finansial Interaktif**:
   - Analitik arus kas lengkap (Pemasukan, Pengeluaran, Saldo).
   - Filter periode cepat: Mingguan, Bulanan, Tahunan, dan Custom Date Range.
   - Pilihan visualisasi dinamis antara Pie Chart breakdown kategori dan Line Chart tren harian.
6. 📸 **OCR Smart Receipt Scanner**:
   - Modal pencatatan transaksi yang dilengkapi fitur upload struk belanja fisik dengan ekstrak item otomatis.

---

## 📂 Struktur Folder

```
fs/fe/
├── public/                       # Static Assets & Icons
├── src/
│   ├── api/                      # Axios Instance, API Endpoints & Query Keys
│   │   ├── auth.js
│   │   ├── axios-instance.js     # Interceptor with NProgress hook
│   │   ├── query-keys.js
│   │   ├── transaction.js
│   │   └── user.js
│   ├── components/               # Reusable UI & Modal Components
│   │   ├── ButtonComponent.jsx
│   │   ├── CategoryDetailItemComponent.jsx
│   │   ├── CustomDatePickerComponent.jsx
│   │   ├── FormAuthComponent.jsx
│   │   ├── FormErrorAlert.jsx    # Elevated error message banner
│   │   ├── HistoryCardComponent.jsx
│   │   ├── InputComponent.jsx    # Form input with error support
│   │   ├── InputTransactionComponent.jsx
│   │   ├── ItemRowTransactionComponent.jsx
│   │   ├── LayoutAuthComponent.jsx
│   │   ├── LayoutMainContent.jsx
│   │   ├── LineChartComponent.jsx
│   │   ├── LoginPageComponent.jsx
│   │   ├── ModalLayoutInputAndProfil.jsx
│   │   ├── ModalTypeComponent.jsx
│   │   ├── NavbarSide.jsx        # Responsive sidebar navigation
│   │   ├── OcrSectionComponent.jsx
│   │   ├── PieChartComponent.jsx
│   │   ├── ProfilModalComponent.jsx
│   │   ├── SummaryCardComponent.jsx
│   │   ├── TopStatComponent.jsx
│   │   └── TransactionItemModal.jsx
│   ├── contexts/                 # Context Providers (AuthContext, ToastContext)
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/                    # Custom Hooks & TanStack Query Hooks
│   │   ├── useAuth.js
│   │   ├── useInput.js
│   │   ├── useToast.js
│   │   └── useTransactionsQuery.js
│   ├── lib/                      # Library Configs (nprogress, queryClient)
│   │   ├── nprogress.js
│   │   └── queryClient.js
│   ├── pages/                    # Page Views
│   │   ├── DashboardPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NewPasswordPage.jsx
│   │   ├── NotFoundPage.jsx      # 404 Error Page
│   │   ├── RegisterPage.jsx
│   │   ├── ResendVerifikasiEmail.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   └── VerifikasiEmail.jsx
│   ├── routes/                   # Routing Definitions
│   │   ├── ProtectedRoute.jsx
│   │   └── router.jsx            # TanStack Router configuration
│   ├── utils/                    # Helper Functions
│   │   ├── date-helper.js
│   │   ├── format-rupiah.js
│   │   ├── format-time.js
│   │   ├── get-error-message.js  # UX-friendly error formatter
│   │   └── transaction-helper.js
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css                 # Master Design System Styles
├── tests/                        # Playwright E2E Test Suites
│   ├── auth/
│   │   ├── forgot-password.spec.js
│   │   ├── login.spec.js
│   │   └── register.spec.js
│   ├── dashboard/
│   │   └── dashboard.spec.js
│   ├── history/
│   │   └── history.spec.js
│   └── navigation/
│       └── navigation.spec.js
├── playwright.config.js          # Playwright Test Config
├── eslint.config.js              # ESLint Config
├── vite.config.js                # Vite Config
└── package.json
```

---

## ⚙️ Prasyarat

- **Node.js**: v20.x atau lebih baru
- **NPM**: v10+

---

## 🛠️ Panduan Instalasi & Menjalankan

### 1. Masuk ke Direktori & Instal Dependensi
```bash
cd fs/fe
npm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di root folder `fs/fe`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Jalankan Server Development
```bash
npm run dev
```
Aplikasi dapat diakses di: `http://localhost:5173`

### 4. Build untuk Produksi
```bash
npm run build
npm run preview
```

---

## 🎭 Pengujian (Testing dengan Playwright)

Suite pengujian E2E frontend mencakup seluruh alur pengguna utama:

```bash
# Menjalankan seluruh test Playwright
npm test

# Menjalankan test dalam mode UI interaktif
npx playwright test --ui

# Memeriksa standard kode ESLint
npm run lint
npm run lint-fix
```

---

## 🎨 Desain Sistem & CSS Architecture

Aplikasi menggunakan struktur styling terpusat di [`src/style.css`](file:///d:/coding/js/MoneyLens/fs/fe/src/style.css) dengan directive `@apply`:
- **Warna Identitas**: Emerald Emerald Core (`#1A7A5E`), Emerald Light (`#2FA084`), Mint Glow (`#6FCF97`), Charcoal (`#0F172A`), Slate (`#475569`).
- **Tipografi**: *Plus Jakarta Sans* / *Inter* dengan rendering tajam.
- **Komponen Utilitas**: `.btn-primary`, `.btn-outline`, `.btn-danger`, `.card-base`, `.pill-button-active`, `.form-error-alert`, `.modal-backdrop`, `.modal-footer`.
