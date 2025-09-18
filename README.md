# 💒 Wedding Commerce

Platform marketplace jasa pernikahan terlengkap di Indonesia yang dibangun dengan Goravel Framework.

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

## 🏗️ Arsitektur Sistem

### Tech Stack

- **Backend**: Goravel Framework (Go)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: Redis
- **Authentication**: JWT
- **Frontend**: React.js, Tailwind

### Modul Sistem

- ✅ **Core Booking System**: Sistem pemesanan inti
- ✅ **Payment Modular**: Multiple payment gateway
- ✅ **SEO Modular**: Basic, Advanced, dan Automation
- ✅ **Content Management**: Blog dan FAQ
- ✅ **Vendor Collaboration**: Kolaborasi antar vendor
- ✅ **Subscription System**: Plan Free, Premium, Enterprise
- ✅ **AI Chatbot**: Customer service otomatis (opsional)
- ✅ **Super User Control**: Kontrol penuh platform

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

## 🚀 Quick Start

### Prerequisites

- Go 1.23+
- PostgreSQL 12+
- Redis 6+

### Installation

```bash
# Clone repository
git clone <repository-url>
cd wedding-commerce

# Install dependencies
go mod tidy

# Setup environment
cp .env.example .env
# Edit .env file with your database and Redis configuration

# Run migrations
go run . artisan migrate

# Seed database
go run . artisan db:seed

# Start the application
go run .
```

### Environment Configuration

```env
APP_NAME="Wedding Commerce"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:3000

DB_CONNECTION=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=wedding_commerce
DB_USERNAME=postgres
DB_PASSWORD=password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

JWT_SECRET=your-jwt-secret-key-here
```

## 📚 API Documentation

### Authentication

- `POST /api/v1/auth/register` - Registrasi user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Marketplace (Public)

- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/vendors` - Get vendors with filters
- `GET /api/v1/vendors/{id}` - Get vendor detail
- `GET /api/v1/services` - Get services with filters
- `GET /api/v1/packages` - Get packages with filters

### Customer Routes

- `GET /api/v1/orders` - Get customer orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/{id}` - Get order detail
- `PUT /api/v1/orders/{id}/cancel` - Cancel order

### Vendor Routes

- `GET /api/v1/profile` - Get vendor profile
- `PUT /api/v1/profile` - Update vendor profile
- `GET /api/v1/services` - Get vendor services
- `POST /api/v1/services` - Create service
- `PUT /api/v1/services/{id}` - Update service
- `DELETE /api/v1/services/{id}` - Delete service
- `GET /api/v1/orders` - Get vendor orders
- `PUT /api/v1/orders/{id}/status` - Update order status

### Admin Routes

- `GET /api/v1/dashboard` - Get dashboard statistics
- `GET /api/v1/users` - Get all users
- `GET /api/v1/vendors` - Get all vendors
- `PUT /api/v1/vendors/{id}/status` - Update vendor status
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/module-settings` - Get module settings
- `PUT /api/v1/module-settings/{module}` - Update module setting
- `GET /api/v1/system-settings` - Get system settings
- `PUT /api/v1/system-settings/{key}` - Update system setting

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

## 🔧 Development

### Running Tests

```bash
go test ./...
```

### Database Migrations

```bash
# Create migration
go run artisan make:migration create_table_name

# Run migrations
go run artisan migrate

# Rollback migrations
go run artisan migrate:rollback
```

### Database Seeding

```bash
# Run seeders
go run artisan db:seed

# Run specific seeder
go run artisan db:seed --seeder=CategorySeeder
```

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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- 📧 Email: support@weddingcommerce.com
- 📱 Phone: +6281234567890
- 🌐 Website: https://weddingcommerce.com

## 🙏 Acknowledgments

- [Goravel Framework](https://goravel.dev) - Web framework
- [PostgreSQL](https://postgresql.org) - Database
- [Redis](https://redis.io) - Cache & Queue
- All contributors and supporters

---

Made with ❤️ for the Indonesian wedding industry
