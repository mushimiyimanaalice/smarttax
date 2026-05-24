import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const businessId = localStorage.getItem('activeBusinessId');
    if (businessId) {
      config.headers['X-Business-Id'] = businessId;
    }
    const authStorage = localStorage.getItem('auth-storage');
    if (!businessId && authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const uid = parsed?.state?.user?.activeBusinessId || parsed?.state?.user?.businessId;
        if (uid) {
          config.headers['X-Business-Id'] = uid;
          localStorage.setItem('activeBusinessId', uid);
        }
      } catch (e) { /* ignore */ }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;