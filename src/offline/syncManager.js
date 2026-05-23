import { getPendingSyncItems, updateSyncStatus, updateSyncQueueItem, markSaleSynced } from './database';
import api from '../services/api';

export const initOfflineSync = () => {
  // Listen for online event
  window.addEventListener('online', () => {
    console.log('Back online, syncing data...');
    syncPendingData();
  });
  
  // Initial sync if online
  if (navigator.onLine) {
    setTimeout(syncPendingData, 3000);
  }
  
  // Register background sync for PWA
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(reg => {
      reg.sync.register('sync-sales');
    });
  }
};

export const syncPendingData = async () => {
  if (!navigator.onLine) {
    console.log('Still offline, sync postponed');
    return;
  }
  
  console.log('Starting background sync...');
  
  const pendingItems = await getPendingSyncItems();
  
  if (pendingItems.length === 0) {
    console.log('No pending items to sync');
    return;
  }
  
  console.log(`Found ${pendingItems.length} items to sync`);
  
  for (const item of pendingItems) {
    try {
      await updateSyncStatus(item.id, 'processing');
      
      let response;
      switch (item.type) {
        case 'sale':
          response = await api.post('/sales/offline-sync', item.data);
          if (response.data.success) {
            await markSaleSynced(item.saleId);
          }
          break;
        case 'product':
          response = await api.post('/products', item.data);
          break;
        case 'tax_payment':
          response = await api.post('/taxes/pay', item.data);
          break;
      }
      
      if (response && (response.status === 200 || response.status === 201)) {
        await updateSyncStatus(item.id, 'completed');
        console.log(`Synced item ${item.id} successfully`);
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error(`Sync failed for item ${item.id}:`, error);
      const retryCount = (item.retryCount || 0) + 1;
      
      if (retryCount >= 5) {
        await updateSyncStatus(item.id, 'failed', error.message);
      } else {
        await updateSyncQueueItem(item.id, {
          status: 'pending',
          retryCount,
          lastError: error.message,
        });
      }
    }
  }
  
  console.log('Sync completed');
};

// Periodic sync every 3 minutes when online
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (navigator.onLine) {
      syncPendingData();
    }
  }, 3 * 60 * 1000);
}