export const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      return registration;
    } catch {}
  }
  return null;
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const setupPushNotifications = async (api) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return false;

  try {
    const { data } = await api.get('/notifications/vapid-public-key');
    if (!data.publicKey) return false;

    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();

    if (existing) {
      const existingJson = existing.toJSON();
      try {
        await api.post('/notifications/push-subscribe', {
          subscription: existingJson,
          userAgent: navigator.userAgent,
        });
      } catch {}
      return true;
    }

    const urlBase64ToUint8Array = (base64String) => {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = atob(base64);
      return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    };

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });

    await api.post('/notifications/push-subscribe', {
      subscription: subscription.toJSON(),
      userAgent: navigator.userAgent,
    });

    return true;
  } catch (error) {
    console.warn('Push setup failed:', error);
    return false;
  }
};
