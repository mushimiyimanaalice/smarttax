import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../../services/api';
import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const NotificationBell = ({ userId, token }) => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const load = () => {
    api.get('/notifications/unread-count').then((r) => setCount(r.data.count));
    api.get('/notifications').then((r) => setItems(r.data.slice(0, 10)));
  };

  useEffect(() => {
    if (!userId) return;
    load();
    const socket = io(API_BASE, { auth: { token } });
    socket.emit('join', { userId });
    socket.on('notification', () => load());
    return () => socket.disconnect();
  }, [userId, token]);

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    setCount(0);
    load();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl border z-50 text-gray-800">
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold text-sm">Notifications</span>
            <button type="button" onClick={markAllRead} className="text-xs text-green-600">
              Mark all read
            </button>
          </div>
          {items.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No notifications</p>
          ) : (
            items.map((n) => (
              <div
                key={n._id}
                className={`p-3 border-b text-sm ${!n.read ? 'bg-green-50' : ''}`}
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-gray-600 mt-0.5">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
