import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Notifications</h1>
          <p className="text-sm text-slate-500">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition">
            <CheckCheck className="w-4 h-4" />
            Mark all read
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
              <p className={`text-sm ${n.read ? 'text-theme-secondary' : 'text-theme-primary font-medium'}`}>
                {n.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
              </p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
