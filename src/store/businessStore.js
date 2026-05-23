import { create } from 'zustand';
import api from '../services/api';
import { useAuthStore } from './authStore';

export const useBusinessStore = create((set, get) => ({
  businesses: [],
  activeBusiness: null,
  isLoading: false,

  fetchBusinesses: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/my-businesses');
      set({ businesses: res.data, isLoading: false });
      return res.data;
    } catch (e) {
      set({ isLoading: false });
      return [];
    }
  },

  switchBusiness: async (businessId) => {
    const res = await api.patch('/auth/active-business', { businessId });
    const { updateUser } = useAuthStore.getState();
    updateUser({
      activeBusinessId: businessId,
      businessId,
    });
    set({ activeBusiness: res.data.business });
    localStorage.setItem('activeBusinessId', businessId);
    api.defaults.headers.common['X-Business-Id'] = businessId;
    return res.data;
  },

  initActiveBusiness: async () => {
    const list = await get().fetchBusinesses();
    const authUser = useAuthStore.getState().user;
    const id =
      authUser?.activeBusinessId ||
      authUser?.businessId ||
      localStorage.getItem('activeBusinessId');

    if (id && list.find((b) => b._id === id)) {
      api.defaults.headers.common['X-Business-Id'] = id;
      set({ activeBusiness: list.find((b) => b._id === id) });
    } else if (list[0]) {
      await get().switchBusiness(list[0]._id);
    }
  },
}));
