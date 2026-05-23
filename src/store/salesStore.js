import { create } from 'zustand';
import api from '../services/api';
import { db, saveOfflineSale } from '../offline/database';

export const useSalesStore = create((set, get) => ({
  sales: [],
  currentSale: null,
  pendingSync: [],
  isLoading: false,
  error: null,

  createSale: async (saleData) => {
    const isOnline = navigator.onLine;
    
    if (!isOnline) {
      // Store offline
      const offlineSale = {
        ...saleData,
        id: `offline_${Date.now()}`,
        synced: false,
        createdAt: new Date().toISOString()
      };
      
      await saveOfflineSale(offlineSale);
      set(state => ({ 
        pendingSync: [...state.pendingSync, offlineSale],
        sales: [offlineSale, ...state.sales]
      }));
      return { success: true, offline: true, sale: offlineSale };
    } else {
      try {
        const response = await api.post('/sales', saleData);
        set(state => ({ sales: [response.data.sale, ...state.sales] }));
        return { success: true, data: response.data };
      } catch (error) {
        // If online fails, store offline
        const offlineSale = {
          ...saleData,
          id: `offline_${Date.now()}`,
          synced: false,
          error: error.message,
          createdAt: new Date().toISOString()
        };
        await saveOfflineSale(offlineSale);
        set(state => ({ 
          pendingSync: [...state.pendingSync, offlineSale],
          sales: [offlineSale, ...state.sales]
        }));
        return { success: false, offline: true, error: error.message };
      }
    }
  },

  fetchSales: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/sales');
      set({ sales: response.data.sales, isLoading: false });
    } catch (error) {
      // Get from IndexedDB
      const offlineSales = await db.getAll('sales');
      set({ sales: offlineSales, isLoading: false });
    }
  },

  getTodaySales: () => {
    const today = new Date().toDateString();
    return get().sales.filter(sale => 
      new Date(sale.saleDate || sale.createdAt).toDateString() === today
    );
  },

  getTotalRevenue: () => {
    return get().sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  },

  getTotalTax: () => {
    return get().sales.reduce((sum, sale) => sum + (sale.taxAmount || 0), 0);
  },

  clearError: () => set({ error: null })
}));