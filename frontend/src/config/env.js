// Environment configuration
const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || "Wedding Dream",
  APP_ENV: import.meta.env.VITE_APP_ENV || "development",

  // Debug Configuration
  DEBUG: import.meta.env.VITE_DEBUG === "true" || false,

  // Feature Flags
  FEATURES: {
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true" || false,
    ENABLE_DEBUG_TOOLS:
      import.meta.env.VITE_ENABLE_DEBUG_TOOLS === "true" || false,
  },

  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      ME: "/auth/me",
      REFRESH: "/auth/refresh",
      CHECK_ROLE: "/auth/check-role",
      SUPERADMIN_LOGIN: "/auth/superadmin/login",
    },
    MARKETPLACE: {
      CATEGORIES: "/categories",
      VENDORS: "/vendors",
      SERVICES: "/services",
      PACKAGES: "/packages",
    },
    ORDERS: {
      LIST: "/orders",
      CREATE: "/orders",
      DETAIL: (id) => `/orders/${id}`,
      CANCEL: (id) => `/orders/${id}/cancel`,
    },
    VENDOR: {
      PROFILE: "/vendor/profile",
      SERVICES: "/vendor/services",
      ORDERS: "/vendor/orders",
    },
    ADMIN: {
      DASHBOARD: "/admin/dashboard",
      USERS: "/admin/users",
      VENDORS: "/admin/vendors",
      ORDERS: "/admin/orders",
      MODULE_SETTINGS: "/admin/module-settings",
      SYSTEM_SETTINGS: "/admin/system-settings",
    },
  },

  // Validation Rules
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
  },

  // UI Configuration
  UI: {
    TOAST_DURATION: 4000,
    LOADING_TIMEOUT: 10000,
    DEBOUNCE_DELAY: 300,
  },
};

// Development helpers
if (config.DEBUG) {
  console.log("🔧 Environment Configuration:", config);
}

export default config;
