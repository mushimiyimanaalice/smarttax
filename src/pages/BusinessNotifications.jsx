import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Bell, CheckCheck } from 'lucide-react';

const BusinessNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSpinner />;

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-theme-primary">Notifications</h1>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-xs text-green-600 font-medium flex items-center gap-1">
            <CheckCheck className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => !n.read && markRead(n._id)}
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
              n.read ? 'bg-theme-card border-theme' : 'bg-green-50 border-green-200'
            }`}
          >
            <div className={`p-2 rounded-full ${n.read ? 'bg-slate-100' : 'bg-green-100'}`}>
              <Bell className={`w-4 h-4 ${n.read ? 'text-slate-400' : 'text-green-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${n.read ? 'text-theme-secondary' : 'font-medium text-theme-primary'}`}>{n.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
              </p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessNotifications;
