# Quick Start Guide

Panduan cepat untuk menjalankan Wedding Commerce.

## Backend Setup

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env sesuai kebutuhan

# 2. Setup database
go run . artisan migrate
go run . artisan db:seed

# 3. Generate JWT secret
go run . artisan jwt:secret

# 4. Start backend
go run . serve
```

## Frontend Setup

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment (otomatis)
npm run setup

# 4. Start frontend
npm run dev
```

## Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api/v1

## Test Authentication

1. Buka http://localhost:5173
2. Klik "Daftar" untuk membuat akun baru
3. Isi form registrasi
4. Login dengan akun yang baru dibuat
5. Coba akses halaman yang memerlukan authentication

## Troubleshooting

### Backend tidak bisa start

- Pastikan database sudah running
- Cek konfigurasi di file `.env`
- Cek log di `storage/logs/`

### Frontend tidak bisa start

- Pastikan Node.js 18+ terinstall
- Jalankan `npm install` ulang
- Cek file `.env` sudah dibuat

### API Connection Error

- Pastikan backend sudah running di port 8080
- Cek `VITE_API_URL` di file `frontend/.env`

## Support

Lihat dokumentasi lengkap:

- [AUTH_SETUP.md](AUTH_SETUP.md) - Setup authentication system
- [FRONTEND_SETUP.md](FRONTEND_SETUP.md) - Setup frontend lengkap
