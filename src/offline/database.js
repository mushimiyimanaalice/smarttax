import { openDB } from 'idb';

const DB_NAME = 'SmartTaxDB';
const DB_VERSION = 2;

export const db = await openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    // Sales store
    if (!db.objectStoreNames.contains('sales')) {
      const salesStore = db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
      salesStore.createIndex('date', 'saleDate');
      salesStore.createIndex('synced', 'synced');
    }

    // Products store
    if (!db.objectStoreNames.contains('products')) {
      const productsStore = db.createObjectStore('products', { keyPath: '_id' });
      productsStore.createIndex('businessId', 'businessId');
    }

    // Pending sales store
    if (!db.objectStoreNames.contains('pendingSales')) {
      const pendingStore = db.createObjectStore('pendingSales', { keyPath: 'id' });
      pendingStore.createIndex('createdAt', 'createdAt');
    }

    // Invoices store
    if (!db.objectStoreNames.contains('invoices')) {
      db.createObjectStore('invoices', { keyPath: 'invoiceNumber' });
    }

    // Sync queue store
    if (!db.objectStoreNames.contains('syncQueue')) {
      const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      syncStore.createIndex('status', 'status');
      syncStore.createIndex('createdAt', 'createdAt');
    }
    
    // Products cache store
    if (!db.objectStoreNames.contains('productsCache')) {
      db.createObjectStore('productsCache', { keyPath: '_id' });
    }
  }
});

export const saveOfflineSale = async (sale) => {
  const tx = db.transaction(['sales', 'syncQueue'], 'readwrite');
  const saleId = await tx.objectStore('sales').add({
    ...sale,
    synced: false,
    savedAt: new Date().toISOString()
  });
  
  await tx.objectStore('syncQueue').add({
    type: 'sale',
    data: sale,
    status: 'pending',
    createdAt: new Date().toISOString(),
    saleId
  });
  
  await tx.done;
  return saleId;
};

export const getOfflineSales = async () => {
  return await db.getAll('sales');
};

export const getPendingSyncItems = async () => {
  try {
    return await db.getAllFromIndex('syncQueue', 'status', 'pending');
  } catch (e) {
    console.error('getPendingSyncItems failed:', e);
    return [];
  }
};

export const updateSyncStatus = async (id, status, error = null) => {
  try {
    const tx = db.transaction('syncQueue', 'readwrite');
    const store = tx.objectStore('syncQueue');
    const item = await store.get(id);
    if (item) {
      item.status = status;
      item.error = error;
      item.processedAt = new Date().toISOString();
      await store.put(item);
    }
    await tx.done;
  } catch (e) {
    console.error('updateSyncStatus failed:', e);
  }
};

export const markSaleSynced = async (saleId) => {
  try {
    const tx = db.transaction('sales', 'readwrite');
    const store = tx.objectStore('sales');
    const item = await store.get(saleId);
    if (item) {
      item.synced = true;
      item.syncedAt = new Date().toISOString();
      await store.put(item);
    }
    await tx.done;
  } catch (e) {
    console.error('markSaleSynced failed:', e);
  }
};

export const updateSyncQueueItem = async (id, updates) => {
  try {
    const tx = db.transaction('syncQueue', 'readwrite');
    const store = tx.objectStore('syncQueue');
    const item = await store.get(id);
    if (item) {
      const updated = { ...item, ...updates };
      await store.put(updated);
    }
    await tx.done;
  } catch (e) {
    console.error('updateSyncQueueItem failed:', e);
  }
};

export const clearOldData = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const tx = db.transaction(['sales', 'syncQueue'], 'readwrite');
  await tx.objectStore('sales').index('date').delete(IDBKeyRange.upperBound(thirtyDaysAgo));
  await tx.objectStore('syncQueue').index('createdAt').delete(IDBKeyRange.upperBound(thirtyDaysAgo));
  await tx.done;
};