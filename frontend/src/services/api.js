import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post("/auth/refresh");
        if (refreshResponse.data.success) {
          const newToken = refreshResponse.data.data.token;
          localStorage.setItem("token", newToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          throw new Error("Refresh token failed");
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("token");
        // Only redirect if not already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  refreshToken: () => api.post("/auth/refresh"),
};

export const marketplaceAPI = {
  getCategories: () => api.get("/categories"),
  getVendors: (params) => api.get("/vendors", { params }),
  getVendorDetail: (id) => api.get(`/vendors/${id}`),
  getServices: (params) => api.get("/services", { params }),
  getPackages: (params) => api.get("/packages", { params }),
};

export const orderAPI = {
  getOrders: (params) => api.get("/orders", { params }),
  getOrderDetail: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post("/orders", orderData),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

export const vendorAPI = {
  getProfile: () => api.get("/vendor/profile"),
  updateProfile: (profileData) => api.put("/vendor/profile", profileData),
  getServices: (params) => api.get("/vendor/services", { params }),
  createService: (serviceData) => api.post("/vendor/services", serviceData),
  updateService: (id, serviceData) =>
    api.put(`/vendor/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/vendor/services/${id}`),
  getOrders: (params) => api.get("/vendor/orders", { params }),
  updateOrderStatus: (id, statusData) =>
    api.put(`/vendor/orders/${id}/status`, statusData),
};

export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  getVendors: (params) => api.get("/admin/vendors", { params }),
  updateVendorStatus: (id, statusData) =>
    api.put(`/admin/vendors/${id}/status`, statusData),
  getOrders: (params) => api.get("/admin/orders", { params }),
  getModuleSettings: () => api.get("/admin/module-settings"),
  updateModuleSetting: (module, settingData) =>
    api.put(`/admin/module-settings/${module}`, settingData),
  getSystemSettings: () => api.get("/admin/system-settings"),
  updateSystemSetting: (key, settingData) =>
    api.put(`/admin/system-settings/${key}`, settingData),
};

export const userAPI = {
  getUser: (id) => api.get(`/users/${id}`),
};

export default api;
