import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { MapPin, Building2 } from 'lucide-react';

const AdminBusinessLocations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get('/admin/business-locations');
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

  const locations = data?.locations || [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Business Locations</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-theme-card rounded-xl border border-theme p-5">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-theme-primary">{data?.totalProvinces ?? 0}</p>
              <p className="text-sm text-slate-500">Provinces</p>
            </div>
          </div>
        </div>
        <div className="bg-theme-card rounded-xl border border-theme p-5">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-theme-primary">{data?.totalDistricts ?? 0}</p>
              <p className="text-sm text-slate-500">Districts</p>
            </div>
          </div>
        </div>
        <div className="bg-theme-card rounded-xl border border-theme p-5">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-theme-primary">{data?.totalBusinesses ?? 0}</p>
              <p className="text-sm text-slate-500">Registered Businesses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-theme-card rounded-xl border border-theme overflow-hidden">
        <div className="p-4 border-b border-theme">
          <h2 className="text-base font-semibold text-theme-primary">Business Distribution</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-3 font-medium text-theme-secondary">Province</th>
                <th className="text-left p-3 font-medium text-theme-secondary">District</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Businesses</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Active</th>
                <th className="text-right p-3 font-medium text-theme-secondary">Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {locations.map((loc, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700">{loc.province}</td>
                  <td className="p-3 text-slate-700">{loc.district}</td>
                  <td className="p-3 text-right text-slate-700">{loc.total}</td>
                  <td className="p-3 text-right text-green-600 font-medium">{loc.active}</td>
                  <td className="p-3 text-right text-amber-600 font-medium">{loc.pending}</td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">No location data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBusinessLocations;
