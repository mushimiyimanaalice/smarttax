import { create } from 'zustand';
import api from '../services/api';
import { db } from '../offline/database';

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/products');
      set({ products: response.data, isLoading: false });
      // Cache in IndexedDB
      const tx = db.transaction('products', 'readwrite');
      await tx.store.clear();
      for (const product of response.data) {
        await tx.store.put(product);
      }
      await tx.done;
    } catch (error) {
      // Get from IndexedDB
      const offlineProducts = await db.getAll('products');
      set({ products: offlineProducts, isLoading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      set(state => ({ products: [response.data, ...state.products] }));
      return { success: true, product: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      set(state => ({
        products: state.products.map(p => p._id === id ? response.data : p)
      }));
      return { success: true, product: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      set(state => ({
        products: state.products.filter(p => p._id !== id)
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  getLowStockProducts: () => {
    return get().products.filter(p => p.quantity < 10 && p.quantity > 0);
  }
}));