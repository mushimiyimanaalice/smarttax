import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getHomePath } from '../utils/roles';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Smartphone } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      const role = useAuthStore.getState().user?.role;
      navigate(getHomePath(role));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">ST</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">SmartTax</h1>
          <p className="text-gray-600 mt-2">{t('auth.login')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('common.loading') : t('auth.login')}
          </button>

          <div className="mt-4 text-center">
            <Link to="/register" className="text-green-600 text-sm hover:underline">
              {t('auth.no_account')} {t('auth.register')}
            </Link>
          </div>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-gray-500">
            Secure tax management for Rwanda SMEs
          </p>
          <p className="text-xs text-slate-600 bg-slate-100 rounded-lg px-3 py-2 max-w-sm mx-auto">
            <strong>Government admins:</strong> use your admin email — you will be taken to the desktop admin console, not the business mobile app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;