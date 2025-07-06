import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token management
let authToken = null;

const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const clearAuthToken = () => {
  authToken = null;
  delete api.defaults.headers.common['Authorization'];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// API methods
export const apiService = {
  // Auth token management
  setAuthToken,
  clearAuthToken,

  // Health check
  health: () => api.get('/health'),

  // Authentication
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    logout: () => api.post('/auth/logout'),
    updateProfile: (profileData) => api.put('/auth/profile', profileData),
    getProfile: () => api.get('/auth/profile'),
    changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  },

  // Products
  products: {
    getAll: (params = {}) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getCategories: () => api.get('/categories'),
    getAnimeShows: () => api.get('/anime'),
  },

  // Cart
  cart: {
    get: () => api.get('/cart'),
    add: (productId, quantity = 1) => api.post('/cart', { productId, quantity }),
    update: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
    remove: (productId) => api.delete(`/cart/${productId}`),
    clear: () => api.delete('/cart'),
  },

  // Orders
  orders: {
    create: (orderData) => api.post('/orders', orderData),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    getUserOrders: () => api.get('/orders/user'),
  },

  // Users (admin)
  users: {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
  },
};

export default apiService;
