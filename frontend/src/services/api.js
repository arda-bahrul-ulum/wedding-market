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
        const newToken = refreshResponse.data.data.token;
        localStorage.setItem("token", newToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
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
  getProfile: () => api.get("/profile"),
  updateProfile: (profileData) => api.put("/profile", profileData),
  getServices: (params) => api.get("/services", { params }),
  createService: (serviceData) => api.post("/services", serviceData),
  updateService: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/services/${id}`),
  getOrders: (params) => api.get("/orders", { params }),
  updateOrderStatus: (id, statusData) =>
    api.put(`/orders/${id}/status`, statusData),
};

export const adminAPI = {
  getDashboard: () => api.get("/dashboard"),
  getUsers: (params) => api.get("/users", { params }),
  getVendors: (params) => api.get("/vendors", { params }),
  updateVendorStatus: (id, statusData) =>
    api.put(`/vendors/${id}/status`, statusData),
  getOrders: (params) => api.get("/orders", { params }),
  getModuleSettings: () => api.get("/module-settings"),
  updateModuleSetting: (module, settingData) =>
    api.put(`/module-settings/${module}`, settingData),
  getSystemSettings: () => api.get("/system-settings"),
  updateSystemSetting: (key, settingData) =>
    api.put(`/system-settings/${key}`, settingData),
};

export const userAPI = {
  getUser: (id) => api.get(`/users/${id}`),
};

export default api;

