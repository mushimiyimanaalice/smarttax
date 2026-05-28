import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatCard from '../../components/Common/StatCard';
import { ShieldAlert, AlertTriangle, Users, Activity, RefreshCw } from 'lucide-react';

const AdminSecurity = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/security/overview');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Security Center</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Failed Logins (24h)" value={data?.failedLogins ?? 0} icon={ShieldAlert} color="red" />
        <StatCard title="Suspicious Activities" value={data?.suspiciousActivities ?? 0} icon={AlertTriangle} color="amber" />
        <StatCard title="Active Sessions" value={data?.activeSessions ?? 0} icon={Users} color="green" />
        <StatCard title="Security Alerts" value={data?.securityAlerts ?? 0} icon={Activity} color="purple" />
      </div>

      <div className=" bg-theme-card rounded-xl border border-theme p-4 sm:p-6">
        <h2 className="text-base font-semibold text-theme-primary mb-4">Recent Security Events</h2>
        <div className="space-y-3">
          {data?.recentEvents?.map((event, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className={`p-1.5 rounded-full ${
                event.severity === 'high' ? 'bg-red-100 text-red-600' :
                event.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-theme-primary">{event.type}</p>
                <p className="text-xs text-slate-500 truncate">{event.description}</p>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {event.timestamp ? new Date(event.timestamp).toLocaleString() : ''}
              </span>
            </div>
          ))}
          {(!data?.recentEvents || data.recentEvents.length === 0) && (
            <p className="text-center text-slate-500 py-6">No security events recorded</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;
