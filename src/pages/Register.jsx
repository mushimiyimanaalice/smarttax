import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ChevronDown, Mail, Phone, Building2, FileText, Tag, MapPin, Globe, Shield, CheckCircle, ArrowLeft, ArrowRight, User } from 'lucide-react';
import api from '../services/api';
import { PROVINCES, DISTRICTS_MAP, SECTORS_MAP } from '../data/rwandaGeo';

const BUSINESS_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'company', label: 'Company' },
  { value: 'partnership', label: 'Partnership' },
];

const STEPS = [
  { num: 1, title: 'Personal Info', icon: User },
  { num: 2, title: 'Business Info', icon: Building2 },
  { num: 3, title: 'Location', icon: MapPin },
  { num: 4, title: 'Security', icon: Shield },
];

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register } = useAuthStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phoneNumber: '',
    password: '', confirmPassword: '',
    businessData: {
      name: '', registrationNumber: '', tin: '', businessType: 'individual',
      address: { province: '', district: '', sector: '', cell: '' },
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const districts = formData.businessData.address.province
    ? DISTRICTS_MAP[formData.businessData.address.province] || []
    : [];
  const sectors = formData.businessData.address.district
    ? SECTORS_MAP[formData.businessData.address.district] || []
    : [];

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const updateBiz = (field, value) => setFormData((prev) => ({ ...prev, businessData: { ...prev.businessData, [field]: value } }));
  const updateAddr = (field, value) => {
    const addr = { ...formData.businessData.address, [field]: value };
    if (field === 'province') { addr.district = ''; addr.sector = ''; }
    if (field === 'district') { addr.sector = ''; }
    setFormData((prev) => ({ ...prev, businessData: { ...prev.businessData, address: addr } }));
  };

  const nextStep = () => {
    setError('');
    if (step === 1 && (!formData.fullName || !formData.email || !formData.phoneNumber)) { setError('Please fill in all personal information fields.'); return; }
    if (step === 2 && (!formData.businessData.name || !formData.businessData.tin)) { setError('Please fill in all business information fields.'); return; }
    if (step === 3 && (!formData.businessData.address.province || !formData.businessData.address.district || !formData.businessData.address.sector)) { setError('Please select your full location.'); return; }
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setIsLoading(true); setError('');
    const result = await register({ ...formData, role: 'business_owner' });
    setIsLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error || 'Registration failed');
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2";
  const inputStyle = { background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': '#00A551' };
  const selectClass = "w-full pl-10 pr-4 py-3 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 appearance-none cursor-pointer";
  const selectStyle = { background: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': '#00A551' };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-body)' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}>
            <span className="text-white font-bold text-xl">ST</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('auth.register')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Create your SmartTax account</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon;
            const isActive = step === s.num;
            const isDone = s.num < step;
            return (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 ${isDone ? 'text-white' : isActive ? 'text-white' : ''}`}
                    style={{
                      borderColor: isDone || isActive ? '#00A551' : 'var(--border-color)',
                      background: isDone ? '#00A551' : isActive ? 'linear-gradient(135deg, #003DA5, #00A551)' : 'var(--bg-card)',
                      boxShadow: isActive ? '0 0 0 4px rgba(0,165,81,0.2)' : 'none'
                    }}
                  >
                    {isDone ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-4.5 h-4.5" />}
                  </div>
                  <span className="text-[10px] mt-1.5 font-medium hidden sm:block" style={{ color: isActive || isDone ? '#00A551' : 'var(--text-secondary)' }}>{s.title}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-8 sm:w-16 h-0.5 mx-2 rounded transition-colors" style={{ background: isDone ? '#00A551' : 'var(--border-color)' }} />
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4 animate-[slide-up_0.3s_ease-out]">
              <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <User className="w-5 h-5" style={{ color: '#003DA5' }} />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Personal Information</h2>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Step 1 of 4 — Tell us about yourself</p>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
                <input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => update('fullName', e.target.value)} className={inputClass} style={inputStyle} required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
                <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => update('email', e.target.value)} className={inputClass} style={inputStyle} required />
              </div>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
                <input type="tel" placeholder="Phone Number (e.g., 0788XXXXXX)" value={formData.phoneNumber} onChange={(e) => update('phoneNumber', e.target.value)} className={inputClass} style={inputStyle} required />
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {step === 2 && (
            <div className="space-y-4 animate-[slide-up_0.3s_ease-out]">
              <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <Building2 className="w-5 h-5" style={{ color: '#FAD201' }} />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Business Information</h2>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Step 2 of 4 — Tell us about your business</p>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
                <input type="text" placeholder="Business Name" value={formData.businessData.name} onChange={(e) => updateBiz('name', e.target.value)} className={inputClass} style={inputStyle} required />
              </div>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
                <input type="text" placeholder="TIN / Registration Number" value={formData.businessData.tin} onChange={(e) => updateBiz('tin', e.target.value)} className={inputClass} style={inputStyle} required />
              </div>
              <div className="relative">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none z-10" style={{ color: 'var(--text-secondary)' }} />
                <select value={formData.businessData.businessType} onChange={(e) => updateBiz('businessType', e.target.value)} className={selectClass} style={selectStyle}>
                  {BUSINESS_TYPES.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
              </div>
            </div>
          )}

          {/* Step 3: Business Location */}
          {step === 3 && (
            <div className="space-y-4 animate-[slide-up_0.3s_ease-out]">
              <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <MapPin className="w-5 h-5" style={{ color: '#00A551' }} />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Business Location</h2>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Step 3 of 4 — Where is your business located?</p>
              <p className="text-xs font-medium px-3 py-2 rounded-lg" style={{ background: 'rgba(0,165,81,0.08)', color: '#00A551' }}>
                Your sector admin will review your business based on this location.
              </p>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none z-10" style={{ color: 'var(--text-secondary)' }} />
                <select value={formData.businessData.address.province} onChange={(e) => updateAddr('province', e.target.value)} className={selectClass} style={selectStyle} required>
                  <option value="">Select Province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none z-10" style={{ color: 'var(--text-secondary)' }} />
                <select value={formData.businessData.address.district} onChange={(e) => updateAddr('district', e.target.value)} className={selectClass} style={selectStyle} required disabled={!formData.businessData.address.province}>
                  <option value="">Select District</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none z-10" style={{ color: 'var(--text-secondary)' }} />
                <select value={formData.businessData.address.sector} onChange={(e) => updateAddr('sector', e.target.value)} className={selectClass} style={selectStyle} required disabled={!formData.businessData.address.district}>
                  <option value="">Select Sector</option>
                  {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
              </div>
            </div>
          )}

          {/* Step 4: Security */}
          {step === 4 && (
            <div className="space-y-4 animate-[slide-up_0.3s_ease-out]">
              <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <Shield className="w-5 h-5" style={{ color: '#003DA5' }} />
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Security</h2>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Step 4 of 4 — Set your account password</p>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Password (min 6 characters)" value={formData.password} onChange={(e) => update('password', e.target.value)} className={inputClass} style={{ ...inputStyle, paddingRight: '3rem' }} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} /> : <Eye className="w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />}
                </button>
              </div>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-secondary)' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className={inputClass} style={inputStyle} required />
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm border transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <ArrowLeft className="w-4.5 h-4.5" />
                Back
              </button>
            )}
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #003DA5, #00A551)' }}>
                Next
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            ) : (
              <button type="submit" disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #00A551, #008040)' }}>
                {isLoading ? 'Creating account...' : 'Create Account'}
                <CheckCircle className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          <div className="text-center">
            <Link to="/login" className="text-sm hover:underline font-medium transition-colors" style={{ color: '#00A551' }}>
              Already have an account? Sign in
            </Link>
          </div>

          <p className="text-xs text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
            By registering, you agree to SmartTax terms of service.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
