# 🏦 MoneyLens - Backend API Service

> RESTful API Service untuk **MoneyLens** yang dibangun dengan **Express.js 5**, **PostgreSQL**, **Redis**, dan **Vitest**.

---

## 📋 Daftar Isi
- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Struktur Folder](#-struktur-folder)
- [Prasyarat](#-prasyarat)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Environment Variables](#-environment-variables)
- [Database Migration](#-database-migration)
- [Pengujian (Testing dengan Vitest)](#-pengujian-testing-dengan-vitest)
- [Rate Limiting (Redis) & Error Handling](#-rate-limiting-redis--error-handling)
- [Daftar Endpoint API](#-daftar-endpoint-api)

---

## 🚀 Tech Stack

| Komponen | Teknologi |
|---|---|
| **Runtime & Framework** | Node.js (v20+), Express.js v5 |
| **Database** | PostgreSQL 16 (`pg`, `node-pg-migrate`) |
| **Caching & Rate Limiting** | Redis (`redis`, `rate-limit-redis`) |
| **Autentikasi & Keamanan** | JWT (`jsonwebtoken`), Google OAuth2 (`google-auth-library`), Helmet, CORS, Cookie-Parser, Bcrypt |
| **Testing** | Vitest, Supertest |
| **Email Service** | Resend API, Nodemailer |
| **File Storage & OCR Bridge** | Multer, Cloudinary, Axios, Form-Data |

---

## ⚡ Fitur Utama

- 🔐 **Autentikasi Lengkap**: Email & Password, Google OAuth2, HTTP-only Cookies, Refresh Token Renewal, Email Verification Token, dan Forgot/Reset Password.
- 🛡️ **Distributed Rate Limiting**: Proteksi endpoint brute-force dan spam request berbasis Redis (`ratelimit:*`).
- 📊 **Pengelolaan Transaksi**: Pencatatan multi-item breakdown untuk pengeluaran (kategori, kuantitas, diskon, pajak) dan pemasukan.
- 📈 **Dashboard & History API**: Agregasi analitik kas, filter tanggal fleksibel (Mingguan, Bulanan, Tahunan, Custom Range), serta pencarian kata kunci dengan paginasi.
- 🤖 **Integrasi OCR**: Menghubungkan upload struk fisik ke microservice AI/ML dan Cloudinary.
- 🧪 **Vitest Integration Tests**: Suite pengujian terstruktur per modul di `tests/integration/` dengan coverage lengkap.

---

## 📂 Struktur Folder

```
fs/be/
├── cmd/                          # Script CLI & Database Generator
│   └── generate.js
├── migrations/                   # Database Migration Files (node-pg-migrate)
│   ├── 1776374027116_users.js
│   ├── 1776375971165_verifikasi-email.js
│   ├── 1776781972445_reset-password.js
│   ├── 1778138948951_transactions.js
│   └── 1778139495937_transaction-details.js
├── src/
│   ├── container.js              # Dependency Injection Container
│   ├── databases/                # Database Pool & Redis Client
│   │   ├── database-pool.js
│   │   ├── redis-client.js
│   │   └── cron-db.js
│   ├── exceptions/               # Custom Domain & Client Errors
│   │   ├── client-error.js
│   │   └── error.js
│   ├── middlewares/              # Express Middlewares
│   │   ├── authenticate-token.js
│   │   ├── error-handling.js     # Production Error Masking
│   │   ├── rate-limiter.js       # Redis Distributed Rate Limiter
│   │   ├── upload-file-middleware.js
│   │   ├── validate.js
│   │   └── verify-verified-email.js
│   ├── routes.js                 # Central Route Aggregator
│   ├── security/                 # JWT Token Manager
│   │   └── token-manager.js
│   ├── server.js                 # Express Application Entrypoint
│   ├── services/                 # Modular Business Logic
│   │   ├── authentications/      # Modul Auth (Controller, Repo, Routes, Validator)
│   │   ├── transactions/         # Modul Transaksi (Controller, Repo, Routes, Validator)
│   │   └── users/                # Modul Pengguna (Controller, Repo, Routes, Validator)
│   └── utils/                    # Mail Sender, Response Formatter, Cloudinary Upload
│       ├── mail-sender.js
│       ├── response.js
│       └── upload-file.js
├── tests/                        # Vitest Test Suites
│   ├── integration/
│   │   ├── authentications.test.js
│   │   ├── transactions.test.js
│   │   └── users.test.js
│   ├── helpers/
│   ├── mocks/
│   └── unit/
├── vitest.config.js              # Vitest Configuration
├── eslint.config.js              # ESLint Configuration
├── Dockerfile                    # Containerization Setup
├── docker-compose.yml            # Local PostgreSQL + Redis Setup
└── package.json
```

---

## ⚙️ Prasyarat

- **Node.js**: v20.x atau lebih baru
- **PostgreSQL**: v14+
- **Redis**: v6+ (atau gunakan Docker Compose)

---

## 🛠️ Panduan Instalasi & Menjalankan

### 1. Masuk ke Direktori & Instal Dependensi
```bash
cd fs/be
npm install
```

### 2. Konfigurasi Environment Variables
Salin template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi kredensial database PostgreSQL, Redis, JWT Secret, dan Google OAuth.

### 3. Jalankan Database (Docker Alternatif)
Jika tidak menggunakan PostgreSQL/Redis lokal, jalankan container:
```bash
docker compose up -d
```

### 4. Eksekusi Migrasi Database
```bash
npm run migrate:up
```

### 5. Jalankan Server
```bash
# Mode Development (Auto-reload dengan nodemon)
npm run dev

# Mode Production
npm start
```
Server akan berjalan di: `http://localhost:5000`

---

## 🧪 Pengujian (Testing dengan Vitest)

Test suite integrasi backend menggunakan **Vitest** dan **Supertest**:

```bash
# Menjalankan seluruh test suite sekali
npm test

# Menjalankan test dalam mode watch interaktif
npm run test:watch

# Memeriksa standard kode ESLint
npm run lint
npm run lint-fix
```

---

## 🛡️ Rate Limiting & Error Handling

- **Redis Rate Limiting**:
  - `loginLimiter`: Maks. 5 percobaan login / 15 menit.
  - `registerLimiter`: Maks. 10 pendaftaran / 1 jam.
  - `resendLimiter` & `resetPasswordLimiter`: Cooldown 3 menit per request.
  - `transactionLimiter`: Maks. 30 mutasi transaksi / menit.
  - `uploadOcrLimiter`: Maks. 10 upload OCR / jam.
- **Production Error Masking**:
  - Saat `NODE_ENV === 'production'`, seluruh error internal 500 disamarkan menjadi pesan ramah pengguna: *"Terjadi kesalahan pada server, silakan coba beberapa saat lagi"*, sambil tetap mencatat log stack trace di terminal server.

---

## 📡 Daftar Endpoint API

### 🔐 Autentikasi (`/api/auth`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/api/auth` | Login pengguna (menghasilkan Access Token & Refresh Token) | Publik |
| `PUT` | `/api/auth` | Memperbarui Access Token menggunakan Refresh Token | Cookie / Body |
| `DELETE` | `/api/auth` | Logout pengguna dan menghapus sesi | Cookie / Body |
| `GET` | `/api/auth/verify-email` | Verifikasi token email pendaftaran | Publik |
| `POST` | `/api/auth/resend-verif` | Mengirim ulang token verifikasi email | Bearer Token |
| `POST` | `/api/auth/reset-password` | Mengirim tautan reset kata sandi ke email | Publik |

### 👤 Pengguna (`/api/users`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/api/users` | Registrasi akun pengguna baru | Publik |
| `POST` | `/api/users/google-login` | Login / registrasi via Google OAuth2 | Publik |
| `POST` | `/api/users/reset-password` | Eksekusi pembaruan kata sandi baru dengan token | Publik |
| `GET` | `/api/users` | Mendapatkan data profil pengguna yang sedang login | Bearer Token |
| `PUT` | `/api/users` | Memperbarui nama lengkap pengguna | Bearer Token |

### 💳 Transaksi (`/api/transactions`)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/api/transactions/expense` | Mencatat transaksi pengeluaran (multi-item) | Bearer Token |
| `POST` | `/api/transactions/income` | Mencatat transaksi pemasukan | Bearer Token |
| `POST` | `/api/transactions/upload` | Mengunggah nota/struk belanja untuk diproses OCR | Bearer Token |
| `GET` | `/api/transactions/dashboard` | Mengambil data analitik dan ringkasan keuangan dashboard | Bearer Token |
| `GET` | `/api/transactions/history` | Mengambil riwayat transaksi dengan filter & paginasi | Bearer Token |
| `DELETE` | `/api/transactions` | Menghapus transaksi berdasarkan ID | Bearer Token |
