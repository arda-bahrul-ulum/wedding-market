# 💒 Wedding Dream

Platform marketplace jasa pernikahan terlengkap di Indonesia yang dibangun dengan Goravel Framework (Go) dan React.js.

## 📖 Deskripsi Project

Wedding Dream adalah platform marketplace yang menghubungkan customer dengan vendor jasa pernikahan di seluruh Indonesia. Platform ini menyediakan sistem booking, pembayaran escrow, review & rating, dan manajemen pesanan yang terintegrasi untuk memudahkan proses perencanaan pernikahan.

### 🎯 Tujuan

- Memudahkan customer menemukan vendor pernikahan terbaik
- Memberikan platform yang aman dan terpercaya untuk transaksi
- Meningkatkan visibilitas vendor jasa pernikahan
- Menyediakan tools manajemen yang lengkap untuk semua pihak

## 🛠️ Teknologi yang Digunakan

### Backend

- **Framework**: Goravel (Go Web Framework)
- **Database**: PostgreSQL 12+
- **Cache & Queue**: Redis 6+
- **Authentication**: JWT (JSON Web Token)
- **Hot Reload**: Air (Development)
- **ORM**: Goravel ORM

### Frontend

- **Framework**: React.js 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React

### Development Tools

- **Version Control**: Git
- **Package Manager**: npm (Frontend), go mod (Backend)
- **Hot Reload**: Air (Backend), Vite (Frontend)
- **Code Quality**: ESLint, Prettier

## 🚀 Cara Instalasi

### Prerequisites

- **Go**: 1.23+
- **Node.js**: 18+
- **PostgreSQL**: 12+
- **Redis**: 6+
- **Git**: Latest

### 1. Clone Repository

```bash
git clone https://github.com/arda-bahrul-ulum/wedding-market.git
cd wedding-market
```

### 2. Setup Backend

```bash
# Install Go dependencies
go mod tidy

# Install Air untuk hot reload (opsional)
go install github.com/air-verse/air@latest

# Setup environment
cp .env.example .env
# Edit .env file dengan konfigurasi database dan Redis
```

### 3. Setup Frontend

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Install Tailwind plugins (jika belum)
npm install @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio @headlessui/react
```

### 4. Setup Database

```bash
# Kembali ke root project
cd ..

# Jalankan migration
go run . artisan migrate

# Jalankan seeder
go run . artisan db:seed
```

## 🧪 Testing

### Automated Testing

```bash
# Run all tests
go test ./tests/...

# Run specific test file
go test ./tests/feature/auth_test.go -v

# Run tests with coverage
go test ./tests/... -cover

# Run comprehensive test suite
./run_tests.sh
```

### API Simulation

```bash
# Run API simulation (requires Python 3)
python3 simulate_api.py

# Run simulation with custom base URL
python3 simulate_api.py http://localhost:8080
```

### Manual Testing

Lihat [TESTING_GUIDE.md](TESTING_GUIDE.md) untuk panduan lengkap testing manual dengan cURL dan Postman.

## 🏃‍♂️ Cara Menjalankan

### Development Mode

#### Terminal 1: Backend (dengan Hot Reload)

```bash
# Di root project
air
# atau
go run .
```

#### Terminal 2: Frontend (dengan Hot Reload)

```bash
# Di folder frontend
cd frontend
npm run dev
```

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Jalankan backend
cd ..
go run .
```

### Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8080
- **Backend Welcome**: http://127.0.0.1:8080

## ✨ Fitur yang Tersedia

### ✅ Authentication & Authorization

- User registration (Customer & Vendor)
- JWT-based authentication
- Role-based access control
- Password validation & hashing
- Token refresh mechanism

### ✅ Marketplace

- Browse categories, vendors, services, packages
- Advanced filtering & search
- Pagination support
- Vendor detail pages
- Public review system

### ✅ Customer Features

- Order management
- Wishlist functionality
- Review & rating system
- Profile management
- Order history & tracking

### ✅ Vendor Features

- Vendor profile management
- Service & package management
- Portfolio showcase
- Order management
- Review response system
- Business analytics

### ✅ Admin Features

- Dashboard with statistics
- User management
- Vendor verification
- Order oversight
- System settings
- Module configuration

### ✅ Additional Features

- Comprehensive error handling
- Input validation
- CORS support
- Database migrations
- Sample data seeding
- Performance optimization

## 📱 Menu dan Fitur

### 🌐 Frontend (React App)

#### **Public Pages**

- **Homepage**: Landing page dengan hero section dan fitur utama
- **Marketplace**: Browse vendor, kategori, dan layanan
- **Vendor Detail**: Profil lengkap vendor dengan portfolio
- **Service Detail**: Detail layanan dengan pricing dan review

#### **Authentication**

- **Login**: Masuk ke akun
- **Register**: Daftar sebagai customer atau vendor
- **Forgot Password**: Reset password

#### **Customer Dashboard**

- **Dashboard**: Overview pesanan dan wishlist
- **Orders**: Daftar dan tracking pesanan
- **Wishlist**: Simpan vendor favorit
- **Profile**: Kelola profil pribadi
- **Reviews**: Berikan review dan rating

#### **Vendor Dashboard**

- **Dashboard**: Statistik bisnis dan pesanan
- **Profile**: Kelola profil bisnis
- **Services**: Kelola layanan yang ditawarkan
- **Orders**: Kelola pesanan customer
- **Portfolio**: Upload galeri dan portfolio
- **Availability**: Atur jadwal ketersediaan

#### **Admin Panel**

- **Dashboard**: Statistik platform
- **Users**: Kelola customer dan vendor
- **Orders**: Monitor semua transaksi
- **Settings**: Konfigurasi sistem
- **Modules**: Aktif/nonaktif fitur

### 🔧 Backend API

#### **Authentication Endpoints**

- `POST /api/v1/auth/register` - Registrasi user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

#### **Public Marketplace**

- `GET /api/v1/categories` - Daftar kategori
- `GET /api/v1/vendors` - Daftar vendor dengan filter
- `GET /api/v1/vendors/{id}` - Detail vendor
- `GET /api/v1/services` - Daftar layanan
- `GET /api/v1/packages` - Daftar paket

#### **Customer Routes** (Protected)

- `GET /api/v1/orders` - Pesanan customer
- `POST /api/v1/orders` - Buat pesanan baru
- `GET /api/v1/orders/{id}` - Detail pesanan
- `PUT /api/v1/orders/{id}/cancel` - Batalkan pesanan

#### **Vendor Routes** (Protected)

- `GET /api/v1/vendor/profile` - Profil vendor
- `PUT /api/v1/vendor/profile` - Update profil
- `GET /api/v1/vendor/services` - Layanan vendor
- `POST /api/v1/vendor/services` - Tambah layanan
- `PUT /api/v1/vendor/services/{id}` - Update layanan
- `DELETE /api/v1/vendor/services/{id}` - Hapus layanan
- `GET /api/v1/vendor/orders` - Pesanan vendor
- `PUT /api/v1/vendor/orders/{id}/status` - Update status pesanan

#### **Admin Routes** (Admin Only)

- `GET /api/v1/admin/dashboard` - Dashboard admin
- `GET /api/v1/admin/users` - Daftar semua user
- `GET /api/v1/admin/vendors` - Daftar semua vendor
- `PUT /api/v1/admin/vendors/{id}/status` - Update status vendor
- `GET /api/v1/admin/orders` - Daftar semua pesanan
- `GET /api/v1/admin/module-settings` - Pengaturan modul
- `PUT /api/v1/admin/module-settings/{module}` - Update modul
- `GET /api/v1/admin/system-settings` - Pengaturan sistem
- `PUT /api/v1/admin/system-settings/{key}` - Update sistem

## 📁 Struktur Project

```
wedding-market/
├── 📁 app/                          # Backend Application
│   ├── 📁 console/                  # Console commands
│   ├── 📁 grpc/                     # gRPC services
│   ├── 📁 http/                     # HTTP controllers & middleware
│   │   ├── 📁 controllers/          # API controllers
│   │   └── 📁 middleware/           # Custom middleware
│   ├── 📁 models/                   # Database models
│   └── 📁 providers/                # Service providers
├── 📁 bootstrap/                    # Application bootstrap
├── 📁 config/                       # Configuration files
├── 📁 database/                     # Database files
│   ├── 📁 migrations/               # Database migrations
│   └── 📁 seeders/                  # Database seeders
├── 📁 frontend/                     # React Frontend
│   ├── 📁 public/                   # Static assets
│   ├── 📁 src/                      # Source code
│   │   ├── 📁 components/           # React components
│   │   ├── 📁 contexts/             # React contexts
│   │   ├── 📁 pages/                # Page components
│   │   ├── 📁 services/             # API services
│   │   └── 📁 utils/                # Utility functions
│   ├── 📄 package.json              # Frontend dependencies
│   └── 📄 vite.config.js            # Vite configuration
├── 📁 public/                       # Public assets
├── 📁 resources/                    # Resources
│   └── 📁 views/                    # Templates
│       └── 📄 welcome.tmpl          # Welcome page
├── 📁 routes/                       # Route definitions
│   ├── 📄 api.go                    # API routes
│   ├── 📄 grpc.go                   # gRPC routes
│   └── 📄 web.go                    # Web routes
├── 📁 storage/                      # Storage directory
├── 📁 tests/                        # Test files
├── 📄 .air.toml                     # Air configuration
├── 📄 .env.example                  # Environment example
├── 📄 artisan                       # Artisan command
├── 📄 docker-compose.yml            # Docker configuration
├── 📄 go.mod                        # Go modules
├── 📄 main.go                       # Application entry point
└── 📄 README.md                     # This file
```

## 🔄 Alur Aplikasi

### 1. **Customer Flow**

```
1. Register/Login → 2. Browse Marketplace → 3. Pilih Vendor →
4. Lihat Detail Layanan → 5. Buat Pesanan → 6. Bayar (Escrow) →
7. Vendor Konfirmasi → 8. Layanan Dilaksanakan → 9. Review & Rating
```

### 2. **Vendor Flow**

```
1. Register/Login → 2. Lengkapi Profil → 3. Tambah Layanan →
4. Upload Portfolio → 5. Terima Pesanan → 6. Konfirmasi Pesanan →
7. Laksanakan Layanan → 8. Terima Pembayaran
```

### 3. **Admin Flow**

```
1. Login Admin → 2. Dashboard Overview → 3. Monitor Users →
4. Kelola Vendors → 5. Monitor Orders → 6. Konfigurasi Sistem
```

### 4. **Technical Flow**

```
Frontend (React) ←→ API (Goravel) ←→ Database (PostgreSQL)
                           ↕
                    Cache (Redis)
```

## 🔧 Environment Configuration

```env
# Application
APP_NAME="Wedding Dream"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8080

# Database
DB_CONNECTION=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=wedding_market
DB_USERNAME=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# JWT
JWT_SECRET=your-jwt-secret-key-here

# Frontend
VITE_API_URL=http://127.0.0.1:8080/api/v1
```

## 🗄️ Database Schema

### Core Tables

- `users` - User accounts (customer, vendor, admin, super_user)
- `vendor_profiles` - Vendor business information
- `categories` - Service categories
- `services` - Individual services
- `packages` - Service packages
- `orders` - Order transactions
- `order_items` - Order line items
- `payments` - Payment records
- `reviews` - Customer reviews
- `wishlists` - Customer wishlists
- `portfolios` - Vendor portfolios
- `availabilities` - Vendor availability calendar
- `chats` - Order-based chat messages

### System Tables

- `module_settings` - Module configuration
- `system_settings` - System configuration

## 🔧 Development Commands

### Backend Development

```bash
# Hot reload development
air

# Run tests
go test ./...

# Create migration
go run . artisan make:migration create_table_name

# Run migrations
go run . artisan migrate

# Rollback migrations
go run . artisan migrate:rollback

# Run seeders
go run . artisan db:seed

# Run specific seeder
go run . artisan db:seed --seeder=CategorySeeder
```

### Frontend Development

```bash
# Development server
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📋 Kategori Jasa

- 🏠 **Venue**: Tempat pernikahan
- 💄 **Make Up Artist**: Jasa rias pengantin
- 🌸 **Dekorasi**: Dekorasi dan bunga
- 📸 **Fotografer**: Jasa fotografi
- 🎥 **Videografer**: Jasa videografi
- 🍽️ **Catering**: Jasa catering
- 📅 **Wedding Organizer**: Paket lengkap
- 🎵 **Entertainment**: Hiburan dan musik
- 🚗 **Transportasi**: Sewa mobil dan transportasi

## 🚀 Fitur Utama

### Untuk Customer

- 🔍 **Pencarian Cerdas**: Temukan vendor berdasarkan lokasi, kategori, dan budget
- 🔒 **Sistem Escrow Aman**: Pembayaran terlindungi hingga pesanan selesai
- ⭐ **Review & Rating**: Baca ulasan dan rating dari customer lain
- 💬 **Chat Langsung**: Komunikasi real-time dengan vendor
- 📱 **Mobile Friendly**: Akses optimal di semua perangkat
- 🛡️ **Vendor Terverifikasi**: Semua vendor telah diverifikasi

### Untuk Vendor

- 📊 **Dashboard Lengkap**: Kelola profil, jasa, dan pesanan
- 📈 **Analitik Performa**: Pantau statistik dan performa bisnis
- 💰 **Sistem Komisi**: Transparan dan otomatis
- 🎯 **Targeting Lokal**: Fokus pada pasar lokal
- 📸 **Portfolio Management**: Kelola galeri dan portofolio
- 📅 **Kalender Ketersediaan**: Atur jadwal dan ketersediaan

### Untuk Admin

- 🎛️ **Panel Kontrol Modular**: Aktif/nonaktif fitur sesuai kebutuhan
- 📊 **Dashboard Analytics**: Monitor performa platform
- 👥 **Manajemen User**: Kelola customer dan vendor
- ⚙️ **Sistem Setting**: Konfigurasi platform yang fleksibel
- 🔧 **Module Management**: Kontrol fitur-fitur platform

## 📈 Roadmap

### MVP (Fase Awal) ✅

- [x] Registrasi customer & vendor
- [x] Booking & pembayaran (Manual Transfer)
- [x] Order tracking
- [x] Rating & review
- [x] Basic admin panel
- [x] SEO Basic

### Growth (Fase Pengembangan)

- [ ] Subscription vendor
- [ ] Wishlist & chat system
- [ ] Promo/voucher
- [ ] DP & cicilan
- [ ] Blog & FAQ
- [ ] Multi payment gateway (Xendit, Midtrans)
- [ ] SEO Advanced (GSC, GA4, GTM)
- [ ] Vendor verification

### Scale-up (Fase Skala)

- [ ] Kolaborasi vendor
- [ ] AI Chatbot (n8n + GPT)
- [ ] Loyalty program & referral
- [ ] Advanced analytics vendor
- [ ] SEO Automation + AI recommendation
- [ ] Multi-currency & multi-language
- [ ] Mobile app

## 🐳 Docker Support

### Development dengan Docker

```bash
# Jalankan semua services
docker-compose up -d

# Hanya database dan Redis
docker-compose up -d postgres redis

# Lihat logs
docker-compose logs -f
```

### Production dengan Docker

```bash
# Build image
docker build -t wedding-market .

# Run container
docker run -p 8080:8080 wedding-market
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- 📧 Email: support@weddingmarket.com
- 📱 Phone: +6281234567890
- 🌐 Website: https://weddingmarket.com
- 🐛 Issues: [GitHub Issues](https://github.com/arda-bahrul-ulum/wedding-market/issues)

## 🙏 Acknowledgments

- [Goravel Framework](https://goravel.dev) - Web framework
- [React.js](https://reactjs.org) - Frontend library
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [PostgreSQL](https://postgresql.org) - Database
- [Redis](https://redis.io) - Cache & Queue
- All contributors and supporters

---

Made with ❤️ for the Indonesian wedding industry
