import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const bid = user?.activeBusinessId || user?.businessId;
          if (bid) {
            localStorage.setItem('activeBusinessId', bid);
            api.defaults.headers.common['X-Business-Id'] = bid;
          }
          set({ token, user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
          return { success: false, error: error.response?.data?.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { confirmPassword, ...payload } = userData;
          const response = await api.post('/auth/register', payload);
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const bid = user?.activeBusinessId || user?.businessId;
          if (bid) {
            localStorage.setItem('activeBusinessId', bid);
            api.defaults.headers.common['X-Business-Id'] = bid;
          }
          set({ token, user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
          return { success: false, error: error.response?.data?.message };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const prevBid = localStorage.getItem('activeBusinessId');
        if (prevBid) api.defaults.headers.common['X-Business-Id'] = prevBid;
        set({ token });

        try {
          const response = await api.get('/auth/me');
          const user = response.data;
          const bid = user?.activeBusinessId || user?.businessId || prevBid;
          if (bid) {
            localStorage.setItem('activeBusinessId', bid);
            api.defaults.headers.common['X-Business-Id'] = bid;
          }
          set({ user });
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('activeBusinessId');
          delete api.defaults.headers.common['Authorization'];
          delete api.defaults.headers.common['X-Business-Id'];
          set({ token: null, user: null });
        }
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);  