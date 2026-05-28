import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getHomePath } from '../utils/roles';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuthStore();
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

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2";
  const inputStyle = { background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': '#00A551' };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-body)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}>
            <span className="text-white font-bold text-xl">ST</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>SmartTax</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{t('auth.login')}</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in to your SmartTax account</p>
          </div>

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="Email Address"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              style={{ ...inputStyle, paddingRight: '3rem' }}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-secondary)' }}
            >
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}
          >
            <LogIn className="w-4.5 h-4.5" />
            {isLoading ? 'Signing in...' : t('auth.login')}
          </button>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#EF4444' }} />
              {error}
            </div>
          )}

          <div className="text-center">
            <Link to="/register" className="text-sm font-medium transition-colors hover:underline" style={{ color: '#00A551' }}>
              Don't have an account? Register
            </Link>
          </div>

          <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
            Secure tax management for Rwanda SMEs
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
