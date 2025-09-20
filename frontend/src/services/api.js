import axios from "axios";
import config from "../config/env.js";

const API_BASE_URL = config.API_URL;

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
  login: (credentials) => api.post(config.ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => api.post(config.ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => api.post(config.ENDPOINTS.AUTH.LOGOUT),
  getMe: () => api.get(config.ENDPOINTS.AUTH.ME),
  refreshToken: () => api.post(config.ENDPOINTS.AUTH.REFRESH),
};

export const marketplaceAPI = {
  getCategories: () => api.get(config.ENDPOINTS.MARKETPLACE.CATEGORIES),
  getVendors: (params) =>
    api.get(config.ENDPOINTS.MARKETPLACE.VENDORS, { params }),
  getVendorDetail: (id) =>
    api.get(`${config.ENDPOINTS.MARKETPLACE.VENDORS}/${id}`),
  getServices: (params) =>
    api.get(config.ENDPOINTS.MARKETPLACE.SERVICES, { params }),
  getPackages: (params) =>
    api.get(config.ENDPOINTS.MARKETPLACE.PACKAGES, { params }),
};

export const orderAPI = {
  getOrders: (params) => api.get(config.ENDPOINTS.ORDERS.LIST, { params }),
  getOrderDetail: (id) => api.get(config.ENDPOINTS.ORDERS.DETAIL(id)),
  createOrder: (orderData) =>
    api.post(config.ENDPOINTS.ORDERS.CREATE, orderData),
  cancelOrder: (id) => api.put(config.ENDPOINTS.ORDERS.CANCEL(id)),
};

export const vendorAPI = {
  getProfile: () => api.get(config.ENDPOINTS.VENDOR.PROFILE),
  updateProfile: (profileData) =>
    api.put(config.ENDPOINTS.VENDOR.PROFILE, profileData),
  getServices: (params) =>
    api.get(config.ENDPOINTS.VENDOR.SERVICES, { params }),
  createService: (serviceData) =>
    api.post(config.ENDPOINTS.VENDOR.SERVICES, serviceData),
  updateService: (id, serviceData) =>
    api.put(`${config.ENDPOINTS.VENDOR.SERVICES}/${id}`, serviceData),
  deleteService: (id) =>
    api.delete(`${config.ENDPOINTS.VENDOR.SERVICES}/${id}`),
  getOrders: (params) => api.get(config.ENDPOINTS.VENDOR.ORDERS, { params }),
  updateOrderStatus: (id, statusData) =>
    api.put(`${config.ENDPOINTS.VENDOR.ORDERS}/${id}/status`, statusData),
};

export const adminAPI = {
  getDashboard: () => api.get(config.ENDPOINTS.ADMIN.DASHBOARD),
  getUsers: (params) => api.get(config.ENDPOINTS.ADMIN.USERS, { params }),
  updateUserStatus: (id, statusData) =>
    api.put(`${config.ENDPOINTS.ADMIN.USERS}/${id}/status`, statusData),
  deleteUser: (id) => api.delete(`${config.ENDPOINTS.ADMIN.USERS}/${id}`),
  getVendors: (params) => api.get(config.ENDPOINTS.ADMIN.VENDORS, { params }),
  updateVendorStatus: (id, statusData) =>
    api.put(`${config.ENDPOINTS.ADMIN.VENDORS}/${id}/status`, statusData),
  getOrders: (params) => api.get(config.ENDPOINTS.ADMIN.ORDERS, { params }),
  getModuleSettings: () => api.get(config.ENDPOINTS.ADMIN.SETTINGS),
  updateModuleSetting: (module, settingData) =>
    api.put(`${config.ENDPOINTS.ADMIN.SETTINGS}/${module}`, settingData),
  getSystemSettings: () => api.get(config.ENDPOINTS.ADMIN.SETTINGS),
  updateSystemSetting: (key, settingData) =>
    api.put(`${config.ENDPOINTS.ADMIN.SETTINGS}/${key}`, settingData),
};

export const userAPI = {
  getUser: (id) => api.get(`/users/${id}`),
};

export default api;
