# Wedding Commerce Frontend

Frontend React.js untuk aplikasi Wedding Commerce Marketplace yang dibangun dengan Vite, Tailwind CSS, dan teknologi modern lainnya.

## 🚀 Teknologi yang Digunakan

- **React.js 18** - Library JavaScript untuk membangun UI
- **Vite** - Build tool dan development server yang cepat
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Routing untuk aplikasi React
- **Axios** - HTTP client untuk komunikasi API
- **Lucide React** - Icon library modern
- **Context API** - State management bawaan React

## 📁 Struktur Folder

```
frontend/
├── public/                 # File statis
├── src/
│   ├── components/         # Komponen reusable
│   │   ├── Auth/          # Komponen authentication
│   │   ├── Cart/          # Komponen keranjang belanja
│   │   ├── Layout/        # Komponen layout (Header, Footer)
│   │   └── UI/            # Komponen UI dasar (Button, Input, Card)
│   ├── contexts/          # React Context untuk state management
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/             # Halaman-halaman aplikasi
│   │   ├── Auth/          # Halaman authentication
│   │   ├── Customer/      # Halaman customer dashboard
│   │   ├── Vendor/        # Halaman vendor dashboard
│   │   ├── Admin/         # Halaman admin dashboard
│   │   ├── Marketplace/   # Halaman marketplace
│   │   └── Error/         # Halaman error
│   ├── services/          # Service layer untuk API
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Komponen utama aplikasi
│   ├── main.jsx           # Entry point aplikasi
│   └── index.css          # Global CSS dengan Tailwind imports
├── index.html             # HTML template
├── package.json           # Dependencies dan scripts
├── tailwind.config.js     # Konfigurasi Tailwind CSS
├── vite.config.js         # Konfigurasi Vite
└── postcss.config.js      # Konfigurasi PostCSS
```

## 🎯 Fitur Utama

### 🔐 Authentication

- Login & Register pengguna
- JWT token management
- Protected routes berdasarkan role
- Auto-refresh token

### 🏪 Marketplace

- Browse kategori dan vendor
- Pencarian dengan filter advanced
- Detail vendor, service, dan package
- Sistem rating dan review
- Wishlist dan favorites

### 🛒 Shopping Cart

- Add/remove items ke keranjang
- Update quantity
- Persistent cart state
- Checkout flow

### 👥 User Roles

#### Customer

- Dashboard personal
- Manajemen orders
- Wishlist management
- Profile settings

#### Vendor

- Dashboard bisnis
- Manajemen profil vendor
- CRUD services dan packages
- Manajemen orders
- Portfolio showcase
- Kalender availability

#### Admin

- Dashboard sistem
- User management
- Vendor approval
- Order monitoring
- System settings

## 🛠 Instalasi dan Setup

### Prerequisites

- Node.js (v16 atau lebih tinggi)
- npm atau yarn
- Backend API berjalan di `http://localhost:8000`

### Langkah Instalasi

1. **Clone repository dan masuk ke folder frontend**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME="Wedding Commerce"
```

4. **Jalankan development server**

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 📝 Scripts yang Tersedia

- `npm run dev` - Menjalankan development server
- `npm run build` - Build aplikasi untuk production
- `npm run preview` - Preview build production
- `npm run lint` - Menjalankan ESLint untuk code linting

## 🎨 Styling dengan Tailwind CSS

Aplikasi ini menggunakan Tailwind CSS dengan konfigurasi custom:

- **Primary Colors**: Menggunakan skema warna biru untuk branding
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Button, Input, Card dengan styling konsisten
- **Dark Mode**: Siap untuk implementasi dark mode

### Utility Classes Kustom

```css
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white;
}
```

## 🔗 Integrasi API

### Base Configuration

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Endpoints Utama

- `POST /auth/login` - Login pengguna
- `POST /auth/register` - Register pengguna
- `GET /marketplace/categories` - Daftar kategori
- `GET /marketplace/vendors` - Daftar vendor dengan pagination
- `GET /marketplace/services` - Daftar layanan
- `GET /marketplace/packages` - Daftar paket

## 🔒 Authentication Flow

1. **Login**: User login dengan email/password
2. **Token Storage**: JWT token disimpan di localStorage
3. **API Interceptor**: Otomatis attach token ke setiap request
4. **Token Refresh**: Auto-refresh token saat expired
5. **Logout**: Clear token dan redirect ke login

## 📱 Responsive Design

- **Mobile First**: Optimized untuk mobile devices
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## 🧩 State Management

### AuthContext

```javascript
const { user, login, logout, register, loading } = useAuth();
```

### CartContext

```javascript
const { items, addItem, removeItem, updateQuantity, clearCart } = useCart();
```

## 🎨 Komponen UI

### Button Component

```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

### Input Component

```jsx
<Input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

### Card Component

```jsx
<Card>
  <CardHeader>
    <h3>Title</h3>
  </CardHeader>
  <CardBody>
    <p>Content</p>
  </CardBody>
</Card>
```

## 🔄 Routing Structure

```
/                          # Homepage
/login                     # Login page
/register                  # Register page
/marketplace               # Marketplace listing
/marketplace/search        # Search results
/vendor/:id                # Vendor detail
/service/:id               # Service detail
/package/:id               # Package detail

# Protected Routes (Customer)
/customer/dashboard        # Customer dashboard
/customer/orders           # Customer orders
/customer/wishlist         # Customer wishlist
/customer/profile          # Customer profile

# Protected Routes (Vendor)
/vendor/dashboard          # Vendor dashboard
/vendor/profile            # Vendor profile
/vendor/services           # Vendor services
/vendor/packages           # Vendor packages
/vendor/orders             # Vendor orders
/vendor/portfolio          # Vendor portfolio
/vendor/availability       # Vendor availability

# Protected Routes (Admin)
/admin/dashboard           # Admin dashboard
/admin/users               # User management
/admin/vendors             # Vendor management
/admin/orders              # Order management
/admin/settings            # System settings
```

## 🚀 Deployment

### Build untuk Production

```bash
npm run build
```

### Deploy ke Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy ke Netlify

```bash
npm run build
# Upload folder dist/ ke Netlify
```

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

- **Frontend Developer** - React.js, Tailwind CSS
- **UI/UX Designer** - Design system, User experience
- **Backend Developer** - Go, Goravel Framework

## 📞 Support

Jika ada pertanyaan atau issue, silakan:

- Buat issue di GitHub repository
- Contact: support@weddingcommerce.com
- Documentation: [docs.weddingcommerce.com](https://docs.weddingcommerce.com)

---

**Wedding Commerce** - Marketplace terpercaya untuk kebutuhan pernikahan Anda! 💒✨

