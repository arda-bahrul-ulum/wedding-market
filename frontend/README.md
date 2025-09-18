# Wedding Commerce Frontend

Frontend aplikasi Wedding Commerce yang dibangun dengan React + Vite + Tailwind CSS.

## Prerequisites

- Node.js 18+
- npm atau yarn
- Backend API sudah running di http://localhost:8080

## Setup Development

### 1. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 2. Environment Configuration

Buat file `.env` di root folder frontend:

```bash
# Copy dari template
cp .env.example .env
```

Edit file `.env` dengan konfigurasi yang sesuai:

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
# atau
yarn dev
```

Aplikasi akan berjalan di http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

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
│   │   └── api.js
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── .env.example          # Environment template
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
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

## API Integration

Frontend berkomunikasi dengan backend melalui:

- **Base URL**: `http://localhost:8080/api/v1`
- **Authentication**: JWT Bearer token
- **Content Type**: `application/json`

### API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

## Environment Variables

| Variable        | Description      | Default                        |
| --------------- | ---------------- | ------------------------------ |
| `VITE_API_URL`  | Backend API URL  | `http://localhost:8080/api/v1` |
| `VITE_APP_NAME` | Application name | `Wedding Commerce`             |
| `VITE_APP_ENV`  | Environment      | `development`                  |
| `VITE_DEBUG`    | Debug mode       | `true`                         |

## Troubleshooting

### Common Issues

1. **API Connection Error**

   - Pastikan backend sudah running di port 8080
   - Cek `VITE_API_URL` di file `.env`

2. **CORS Error**

   - Backend sudah dikonfigurasi untuk CORS
   - Pastikan URL frontend dan backend sesuai

3. **Build Error**

   - Hapus `node_modules` dan `package-lock.json`
   - Jalankan `npm install` ulang

4. **Environment Variables Not Working**
   - Pastikan variable dimulai dengan `VITE_`
   - Restart development server setelah mengubah `.env`

### Debug Mode

Set `VITE_DEBUG=true` di file `.env` untuk:

- Console logging yang lebih detail
- Error boundary yang lebih informatif
- Development tools yang lebih lengkap

## Production Build

```bash
# Build untuk production
npm run build

# Preview production build
npm run preview
```

Build output akan tersimpan di folder `dist/`.

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## License

MIT License - lihat file LICENSE untuk detail.
