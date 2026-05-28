import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

const AdminAiInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/admin/ai-insights');
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">AI Insights</h1>
          <p className="text-sm text-slate-500">Smart analytics powered by Umwishingizi AI</p>
        </div>
        <button onClick={fetchInsights} className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data?.insights?.map((insight, i) => (
          <div key={i} className={`rounded-xl border p-4 sm:p-5 ${
            insight.type === 'warning' ? 'bg-amber-50 border-amber-200' :
            insight.type === 'positive' ? 'bg-green-50 border-green-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                insight.type === 'warning' ? 'bg-amber-100' :
                insight.type === 'positive' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {insight.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                 insight.type === 'positive' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                 <Lightbulb className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-theme-primary">{insight.title}</h3>
                <p className="text-xs text-theme-secondary mt-1">{insight.description}</p>
                {insight.metric && (
                  <p className="text-xs font-medium text-slate-500 mt-2">
                    {insight.metric.label}: <strong>{insight.metric.value}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {(!data?.insights || data.insights.length === 0) && (
          <div className="col-span-full text-center py-12 text-slate-500">
            <Brain className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No AI insights available yet. Data is being analyzed.</p>
          </div>
        )}
      </div>

      {data?.prediction && (
        <div className="bg-theme-card rounded-xl border border-theme p-4 sm:p-6">
          <h2 className="text-base font-semibold text-theme-primary mb-4">Revenue Prediction (Next Quarter)</h2>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.prediction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="predicted" fill="#10b981" radius={[4, 4, 0, 0]} name="Predicted" />
                <Bar dataKey="lower" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Lower Bound" />
                <Bar dataKey="upper" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Upper Bound" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAiInsights;
