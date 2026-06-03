# 💰 MoneyLens

> **Aplikasi pencatatan keuangan pintar berbasis OCR** — cukup foto struk belanja, MoneyLens akan membaca dan mencatat pengeluaranmu secara otomatis.

MoneyLens menggabungkan **Computer Vision (YOLO + TrOCR)** untuk mendeteksi dan membaca teks pada struk belanja, lalu menyimpan hasilnya ke dalam catatan keuangan pengguna melalui **REST API** dan ditampilkan di **dashboard web** yang interaktif.

---

## 📑 Daftar Isi

- [Arsitektur Proyek](#-arsitektur-proyek)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Cara Mereplikasi Proyek](#-cara-mereplikasi-proyek)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Menjalankan AI/ML Service](#2-menjalankan-aiml-service)
  - [3. Menjalankan Backend (API)](#3-menjalankan-backend-api)
  - [4. Menjalankan Frontend (Web)](#4-menjalankan-frontend-web)
- [Struktur Folder](#-struktur-folder)
- [Environment Variables](#-environment-variables)
- [Alur Kerja Tim](#-alur-kerja-tim)
- [README Masing-Masing Komponen](#-readme-masing-masing-komponen)

---

## 🏗 Arsitektur Proyek

```
┌─────────────┐       ┌─────────────────┐       ┌──────────────────┐
│   Frontend   │──────▶│    Backend API   │──────▶│   AI / ML Service │
│  (React+Vite)│◀──────│  (Express.js)   │◀──────│  (Flask + YOLO   │
│  Port: 5173  │       │  Port: 5000     │       │   + TrOCR)       │
└─────────────┘       └───────┬─────────┘       │  Port: 5001      │
                              │                  └──────────────────┘
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────┴─────┐     ┌──────┴──────┐
              │ PostgreSQL │     │    Redis     │
              │ Port: 5432 │     │  Port: 6379  │
              └───────────┘     └─────────────┘
```

---

## 🛠 Tech Stack

| Komponen | Teknologi |
|---|---|
| **AI / ML** | Python 3.11, PyTorch, Ultralytics YOLOv8, TrOCR (HuggingFace Transformers), Flask |
| **Backend** | Node.js, Express.js v5, PostgreSQL, Redis, JWT Auth, Google OAuth |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Recharts, React Router v7 |
| **DevOps** | Docker, Docker Compose |

---

## 📋 Prasyarat

Pastikan perangkat kamu sudah terinstal:

- **Git** — [Download Git](https://git-scm.com/downloads)
- **Node.js** (v18+) — [Download Node.js](https://nodejs.org/)
- **Python** (v3.11+) — [Download Python](https://www.python.org/downloads/)
- **Docker & Docker Compose** — [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **PostgreSQL** (jika tanpa Docker) — [Download PostgreSQL](https://www.postgresql.org/download/)
- **Redis** (jika tanpa Docker) — [Download Redis](https://redis.io/download/)

---

## 🚀 Cara Mereplikasi Proyek

### 1. Clone Repository

**Clone seluruh proyek:**

```bash
git clone https://github.com/capstone-dicoding-proyek/MoneyLens.git
cd MoneyLens
```

**Atau clone folder tertentu saja (sparse checkout):**

```bash
# Clone tanpa download semua file
git clone --filter=blob:none --no-checkout https://github.com/capstone-dicoding-proyek/MoneyLens.git
cd MoneyLens

# Inisialisasi sparse checkout
git sparse-checkout init --cone

# Pilih folder yang dibutuhkan (contoh: hanya AI)
git sparse-checkout set ai        # Hanya folder AI
# git sparse-checkout set fs/be   # Hanya Backend
# git sparse-checkout set fs/fe   # Hanya Frontend
# git sparse-checkout set fs      # Backend + Frontend
# git sparse-checkout set ai fs   # Semua komponen

git checkout main
```

---

### 2. Menjalankan AI/ML Service

AI Service menggunakan **YOLO** untuk mendeteksi area teks pada struk dan **TrOCR** untuk membaca teks yang terdeteksi.

#### Opsi A: Menggunakan Docker (Direkomendasikan)

```bash
cd ai

# Salin file environment
cp .env.example .env

# Edit .env sesuai kebutuhan
# HOST=0.0.0.0
# PORT=5001
# DEBUG=false
# BE_URL=http://localhost:5000

# Build & jalankan container
docker compose up --build -d
```

#### Opsi B: Tanpa Docker (Manual)

```bash
cd ai

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependensi
pip install -r requirements.txt

# Salin dan atur file environment
cp .env.example .env
# Edit .env sesuai kebutuhan

# Jalankan server
python api/app.py
```

> **Catatan:** Model YOLO (`saved_model/best.pt`) sudah tersedia di repo. Model TrOCR akan didownload otomatis dari HuggingFace saat pertama kali dijalankan.

#### Endpoint AI Service

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/health` | Health check |
| `POST` | `/ocr` | Upload gambar struk untuk OCR |

---

### 3. Menjalankan Backend (API)

Backend menggunakan **Express.js** dengan **PostgreSQL** sebagai database dan **Redis** untuk caching/session.

#### Opsi A: Menggunakan Docker (Direkomendasikan)

```bash
cd fs/be

# Salin file environment
cp .env.example .env.docker

# Edit .env.docker sesuai kebutuhan (lihat bagian Environment Variables)

# Jalankan semua services (API + PostgreSQL + Redis)
docker compose up --build -d

# Jalankan migrasi database
docker exec -it moneylens-api npm run migrate:up
```

#### Opsi B: Tanpa Docker (Manual)

```bash
cd fs/be

# Install dependensi
npm install

# Salin dan atur file environment
cp .env.example .env
# Edit .env — pastikan PostgreSQL dan Redis sudah berjalan lokal
# Ubah PGHOST=localhost dan REDIS_HOST=localhost

# Jalankan migrasi database
npm run migrate:up

# Jalankan server (development mode dengan auto-reload)
npm run dev
```

#### Script Tersedia (Backend)

| Script | Perintah | Deskripsi |
|--------|----------|-----------|
| Development | `npm run dev` | Jalankan server dengan nodemon (auto-reload) |
| Production | `npm start` | Jalankan server tanpa auto-reload |
| Migrasi DB | `npm run migrate:up` | Jalankan semua migrasi database |
| Rollback DB | `npm run migrate:down` | Rollback semua migrasi |
| Buat Migrasi | `npm run migrate:create` | Buat file migrasi baru |
| Lint | `npm run lint` | Cek kode dengan ESLint |
| Lint Fix | `npm run lint-fix` | Auto-fix masalah ESLint |
| Test | `npm test` | Jalankan unit test dengan Jest |

---

### 4. Menjalankan Frontend (Web)

Frontend menggunakan **React 19** dengan **Vite** sebagai build tool dan **Tailwind CSS v4** untuk styling.

```bash
cd fs/fe

# Install dependensi
npm install

# Salin dan atur file environment
cp .env.example .env
# Edit .env — sesuaikan URL backend

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`.

#### Script Tersedia (Frontend)

| Script | Perintah | Deskripsi |
|--------|----------|-----------|
| Development | `npm run dev` | Jalankan Vite dev server |
| Build | `npm run build` | Build untuk production |
| Preview | `npm run preview` | Preview hasil build |
| Lint | `npm run lint` | Cek kode dengan ESLint |
| Lint Fix | `npm run lint-fix` | Auto-fix masalah ESLint |

---

## 📁 Struktur Folder

```
MoneyLens/
├── ai/                          # 🤖 AI / Machine Learning Service
│   ├── api/
│   │   └── app.py               # Flask API server
│   ├── notebooks/               # Jupyter notebooks (training & eksperimen)
│   │   ├── preprocessing.ipynb
│   │   ├── build_model.ipynb
│   │   ├── train_ocr.ipynb
│   │   ├── evaluasi.ipynb
│   │   └── ...
│   ├── saved_model/
│   │   ├── best.pt              # Model YOLO terlatih
│   │   └── checkpoint/          # Checkpoint TrOCR
│   ├── src/
│   │   ├── inference.py         # Pipeline inferensi utama
│   │   ├── ocr_model.py         # Wrapper model OCR
│   │   ├── ocr_config.py        # Konfigurasi OCR
│   │   └── text_encoder.py      # Text encoding utilities
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── .env.example
│
├── fs/                          # 🌐 Full Stack (Backend + Frontend)
│   ├── be/                      # ⚙️ Backend API
│   │   ├── src/
│   │   │   └── server.js        # Entry point
│   │   ├── migrations/          # Database migrations
│   │   ├── test/                # Unit tests
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── fe/                      # 🎨 Frontend Web
│       ├── src/
│       │   ├── App.jsx          # Root component
│       │   ├── main.jsx         # Entry point
│       │   ├── components/      # Reusable components
│       │   ├── pages/           # Halaman-halaman
│       │   ├── contexts/        # React Context
│       │   ├── hooks/           # Custom hooks
│       │   ├── api/             # API service layer
│       │   ├── routes/          # Route definitions
│       │   ├── utils/           # Helper functions
│       │   └── styles/          # CSS styles
│       ├── index.html
│       ├── vite.config.js
│       ├── package.json
│       └── .env.example
│
├── ds/                          # 📊 Data Science (eksplorasi & analisis)
│
└── README.md                    # 📄 Dokumentasi ini
```

---

## 🔐 Environment Variables

### AI Service (`ai/.env`)

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `HOST` | Host server | `0.0.0.0` |
| `PORT` | Port server | `5001` |
| `DEBUG` | Mode debug | `false` |
| `BE_URL` | URL Backend API | — |

### Backend (`fs/be/.env`)

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `HOST` | Host server | `0.0.0.0` |
| `PORT` | Port server | `5000` |
| `HOSTFE` | Host frontend (CORS) | `localhost` |
| `PORTFE` | Port frontend (CORS) | `5173` |
| `PGUSER` | Username PostgreSQL | `moneylens` |
| `PGPASSWORD` | Password PostgreSQL | — |
| `PGDATABASE` | Nama database | `moneylens_db` |
| `PGHOST` | Host PostgreSQL | `postgres` |
| `PGPORT` | Port PostgreSQL | `5432` |
| `REDIS_HOST` | Host Redis | `redis` |
| `REDIS_PORT` | Port Redis | `6379` |
| `ACCESS_TOKEN_KEY` | Secret key untuk access token JWT | — |
| `REFRESH_TOKEN_KEY` | Secret key untuk refresh token JWT | — |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | — |
| `SMTP_HOST` | SMTP host untuk email | — |
| `SMTP_PORT` | SMTP port | `2525` |
| `SMTP_USER` | SMTP username | — |
| `SMTP_PASSWORD` | SMTP password | — |

---

## 🔄 Alur Kerja Tim

Gunakan **branching workflow** untuk setiap fitur atau perbaikan:

```bash
# 1. Pastikan branch main terbaru
git checkout main
git pull origin main

# 2. Buat branch baru dari main
git checkout -b <nama-fitur>
# Contoh: git checkout -b feat/dashboard-chart

# 3. Kerjakan perubahan, lalu commit
git add .
git commit -m "feat: deskripsi perubahan"

# 4. Push branch dan buat Pull Request
git push origin <nama-fitur>
```

> ⚠️ **Selalu pull dari `main` sebelum membuat branch baru** agar menghindari conflict.

---

## 📄 README Masing-Masing Komponen

Untuk instruksi lebih detail per komponen, lihat README di masing-masing folder:

| Komponen | README |
|----------|--------|
| 🤖 AI / ML | [ai/README.md](https://github.com/capstone-dicoding-proyek/MoneyLens/blob/main/ai/README.md) |
| 🌐 Full Stack | [fs/README.md](https://github.com/capstone-dicoding-proyek/MoneyLens/blob/main/fs/README.md) |
| 📊 Data Science | [ds/README.md](https://github.com/capstone-dicoding-proyek/MoneyLens/blob/main/ds/README.md) |

---

<p align="center">
  Dibuat dengan sepenuh hati oleh <strong>Tim MoneyLens</strong> — Capstone Project Dicoding
</p>
