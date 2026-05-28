import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, X, Clock, Info, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const typeIcons = { info: Info, warning: AlertCircle, success: CheckCircle, default: Bell };

const NotificationBell = ({ userId, token }) => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const load = () => {
    api.get('/notifications/unread-count').then((r) => setCount(r.data.count)).catch(() => {});
    api.get('/notifications').then((r) => setItems(r.data.slice(0, 15))).catch(() => {});
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
    await api.patch('/notifications/read-all').catch(() => {});
    setCount(0);
    load();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg transition-all duration-200 hover:bg-white/20 active:scale-90"
        aria-label="Notifications"
        style={{ color: 'var(--text-primary)' }}
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[340px] sm:w-[380px] max-h-[420px] rounded-2xl shadow-2xl border overflow-hidden z-50"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" style={{ color: '#00A551' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
              {count > 0 && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                  {count} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {count > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors"
                  style={{ color: '#00A551' }}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark read
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-black/5" style={{ color: 'var(--text-secondary)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[340px]" style={{ scrollbarWidth: 'none' }}>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="w-10 h-10 mb-3" style={{ color: 'var(--text-secondary)', opacity: 0.3 }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No notifications yet</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>You're all caught up!</p>
              </div>
            ) : (
              items.map((n, i) => {
                const Icon = typeIcons[n.type] || typeIcons.default;
                return (
                  <div
                    key={n._id}
                    className={`flex gap-3 px-4 py-3 border-b transition-colors duration-150 cursor-pointer hover:bg-black/[0.02] ${!n.read ? 'bg-green-50/50' : ''}`}
                    style={{ borderColor: 'var(--border-color)', background: !n.read ? 'rgba(0,165,81,0.04)' : 'transparent' }}
                  >
                    <div
                      className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-green-100' : 'bg-slate-100'}`}
                    >
                      <Icon className={`w-4 h-4 ${!n.read ? 'text-green-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock className="w-3 h-3" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                          {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
