# Setup Authentication System

## Backend (Go + Goravel)

### 1. Environment Variables

Buat file `.env` di root project dengan konfigurasi berikut:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=wedding_commerce
DB_USERNAME=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-here
JWT_TTL=60
JWT_REFRESH_TTL=20160

# App
APP_NAME="Wedding Commerce"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080
```

### 2. Database Setup

```bash
# Jalankan migrasi
go run . artisan migrate

# Jalankan seeder
go run . artisan db:seed
```

### 3. Generate JWT Secret

```bash
go run . artisan jwt:secret
```

### 4. Jalankan Server

```bash
go run . serve
```

## Frontend (React + Vite)

### 1. Environment Variables

Buat file `.env` di folder `frontend/` dengan konfigurasi berikut:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Jalankan Development Server

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register user baru
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user (requires auth)
- `GET /api/v1/auth/me` - Get current user info (requires auth)
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Request/Response Format

#### Register Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirm_password": "Password123",
  "role": "customer",
  "phone": "08123456789",
  "agree_terms": true
}
```

#### Login Request

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Success Response

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

#### Error Response

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Features

### Backend Features

- ✅ User registration dengan validasi lengkap
- ✅ User login dengan JWT authentication
- ✅ Password hashing dengan bcrypt
- ✅ JWT middleware untuk proteksi route
- ✅ Role-based access control
- ✅ Input validation dan sanitization
- ✅ Error handling yang konsisten
- ✅ Logging untuk debugging

### Frontend Features

- ✅ Login page dengan validasi form
- ✅ Register page dengan validasi lengkap
- ✅ AuthContext untuk state management
- ✅ Protected routes berdasarkan authentication
- ✅ Role-based route protection
- ✅ Auto token refresh
- ✅ Error handling dan user feedback
- ✅ Responsive design dengan Tailwind CSS

## Testing

### Manual Testing

1. Buka http://localhost:3000
2. Klik "Daftar" untuk membuat akun baru
3. Isi form registrasi dengan data valid
4. Setelah berhasil, login dengan email dan password
5. Coba akses halaman yang memerlukan authentication

### Test Cases

- [ ] Register dengan data valid
- [ ] Register dengan email yang sudah ada
- [ ] Register dengan password yang tidak memenuhi kriteria
- [ ] Login dengan kredensial yang benar
- [ ] Login dengan kredensial yang salah
- [ ] Akses protected route tanpa login
- [ ] Akses protected route dengan login
- [ ] Logout dan redirect ke login page
- [ ] Token refresh otomatis

## Troubleshooting

### Backend Issues

- Pastikan database sudah running dan terhubung
- Pastikan JWT_SECRET sudah di-set
- Cek log di `storage/logs/` untuk error details

### Frontend Issues

- Pastikan VITE_API_URL sudah di-set dengan benar
- Cek browser console untuk error JavaScript
- Pastikan backend sudah running di port 8080

## Security Notes

- Password minimal 8 karakter dengan kombinasi huruf besar, kecil, dan angka
- JWT token memiliki expiry time
- Input validation di backend dan frontend
- CORS sudah dikonfigurasi untuk development
- Password di-hash dengan bcrypt
