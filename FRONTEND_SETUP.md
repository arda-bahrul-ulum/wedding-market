# Frontend Setup Guide

Panduan lengkap untuk setup frontend Wedding Commerce.

## Prerequisites

- Node.js 18+
- npm atau yarn
- Backend API sudah running di http://localhost:8080

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Setup Environment

**Pilih salah satu cara:**

#### Cara 1: Menggunakan Setup Script (Recommended)

```bash
# Linux/Mac
chmod +x setup.sh
./setup.sh

# Windows
setup.bat

# Cross-platform
npm run setup
```

#### Cara 2: Manual Setup

```bash
# Buat file .env dari template
cp env.template .env

# Edit file .env sesuai kebutuhan
nano .env
```

Isi file `.env` dengan:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api/v1

# Development Configuration
VITE_APP_NAME="Wedding Commerce"
VITE_APP_ENV=development

# Optional: Enable debug mode
VITE_DEBUG=true
```

### 3. Start Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di http://localhost:5173

## Environment Variables

| Variable                  | Description        | Default                        | Required |
| ------------------------- | ------------------ | ------------------------------ | -------- |
| `VITE_API_URL`            | Backend API URL    | `http://localhost:8080/api/v1` | ✅       |
| `VITE_APP_NAME`           | Application name   | `Wedding Commerce`             | ❌       |
| `VITE_APP_ENV`            | Environment        | `development`                  | ❌       |
| `VITE_DEBUG`              | Debug mode         | `true`                         | ❌       |
| `VITE_ENABLE_ANALYTICS`   | Enable analytics   | `false`                        | ❌       |
| `VITE_ENABLE_DEBUG_TOOLS` | Enable debug tools | `false`                        | ❌       |

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # Type checking (if using TypeScript)

# Setup & Maintenance
npm run setup           # Run setup script
npm run clean           # Clean and reinstall dependencies
```

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Auth/         # Authentication components
│   │   ├── Cart/         # Shopping cart components
│   │   ├── Layout/       # Layout components
│   │   └── UI/           # UI components
│   ├── config/           # Configuration files
│   │   └── env.js        # Environment configuration
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/            # Page components
│   │   ├── Auth/         # Login/Register pages
│   │   ├── Admin/        # Admin pages
│   │   ├── Customer/     # Customer pages
│   │   ├── Vendor/       # Vendor pages
│   │   └── Marketplace/  # Public marketplace pages
│   ├── services/         # API services
│   │   └── api.js        # API client
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── env.template          # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies & scripts
├── setup.js              # Setup script
├── setup.sh              # Linux/Mac setup script
├── setup.bat             # Windows setup script
├── tailwind.config.js    # Tailwind CSS config
└── vite.config.js        # Vite configuration
```

## Configuration

### Environment Configuration

File `src/config/env.js` berisi semua konfigurasi environment:

```javascript
import config from "./config/env.js";

// Menggunakan konfigurasi
console.log(config.API_URL);
console.log(config.ENDPOINTS.AUTH.LOGIN);
```

### API Configuration

Semua endpoint API dikonfigurasi di `src/config/env.js`:

```javascript
ENDPOINTS: {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    // ...
  },
  MARKETPLACE: {
    CATEGORIES: '/categories',
    VENDORS: '/vendors',
    // ...
  }
}
```

### Validation Rules

Aturan validasi dikonfigurasi di `src/config/env.js`:

```javascript
VALIDATION: {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
  },
  EMAIL: {
    PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
  PHONE: {
    PATTERN: /^08\d{8,11}$/,
  },
}
```

## Features

### Authentication

- ✅ User login/register
- ✅ JWT token management
- ✅ Auto token refresh
- ✅ Protected routes
- ✅ Role-based access control

### UI Components

- ✅ Responsive design dengan Tailwind CSS
- ✅ Form validation dengan react-hook-form
- ✅ Toast notifications dengan react-hot-toast
- ✅ Loading states dan error handling

### State Management

- ✅ AuthContext untuk authentication state
- ✅ CartContext untuk shopping cart state
- ✅ React Query untuk server state

## Troubleshooting

### Common Issues

1. **API Connection Error**

   ```
   Error: Network Error
   ```

   - Pastikan backend sudah running di port 8080
   - Cek `VITE_API_URL` di file `.env`
   - Cek console browser untuk error details

2. **CORS Error**

   ```
   Access to fetch at 'http://localhost:8080/api/v1/auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
   ```

   - Backend sudah dikonfigurasi untuk CORS
   - Pastikan URL frontend dan backend sesuai

3. **Environment Variables Not Working**

   ```
   VITE_API_URL is undefined
   ```

   - Pastikan variable dimulai dengan `VITE_`
   - Restart development server setelah mengubah `.env`
   - Cek file `.env` ada di root folder frontend

4. **Build Error**

   ```
   Failed to resolve import
   ```

   - Hapus `node_modules` dan `package-lock.json`
   - Jalankan `npm install` ulang
   - Cek import path di file yang error

5. **Port Already in Use**
   ```
   Port 5173 is already in use
   ```
   - Ganti port di `vite.config.js`:
   ```javascript
   server: {
     port: 3000, // atau port lain
   }
   ```

### Debug Mode

Set `VITE_DEBUG=true` di file `.env` untuk:

- Console logging yang lebih detail
- Error boundary yang lebih informatif
- Development tools yang lebih lengkap

### Logs

- **Browser Console**: Error JavaScript dan network requests
- **Network Tab**: HTTP requests dan responses
- **Vite Console**: Build errors dan hot reload issues

## Production Build

```bash
# Build untuk production
npm run build

# Preview production build
npm run preview

# Build dengan analisis bundle
npm run build -- --analyze
```

Build output akan tersimpan di folder `dist/`.

## Development Tips

1. **Hot Reload**: File akan otomatis reload saat diubah
2. **Error Overlay**: Error akan ditampilkan di browser
3. **Source Maps**: Debug dengan source maps yang akurat
4. **ESLint**: Code quality check otomatis
5. **TypeScript**: Type checking (jika menggunakan TS)

## Contributing

1. Fork repository
2. Buat feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push ke branch: `git push origin feature/amazing-feature`
5. Buat Pull Request

## Support

Jika mengalami masalah:

1. Cek [Troubleshooting](#troubleshooting) section
2. Cek [Issues](https://github.com/your-repo/issues) di GitHub
3. Buat issue baru dengan detail error
4. Hubungi tim development

## License

MIT License - lihat file LICENSE untuk detail.
