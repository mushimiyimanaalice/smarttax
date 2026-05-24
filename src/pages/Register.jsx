import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import api from '../services/api';

const PROVINCES = [
  'City of Kigali', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province',
];

const DISTRICTS_MAP = {
  'City of Kigali': ['Gasabo', 'Kicukiro', 'Nyarugenge'],
  'Northern Province': ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
  'Southern Province': ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
  'Eastern Province': ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
  'Western Province': ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'],
};

const SECTORS_MAP = {
  'Gasabo': ['Bumbogo', 'Gatsata', 'Gikomero', 'Gisozi', 'Jabana', 'Jali', 'Kacyiru', 'Kimihurura', 'Kimironko', 'Remera', 'Rusororo', 'Rutunga'],
  'Kicukiro': ['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'],
  'Nyarugenge': ['Gitega', 'Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Muhima', 'Nyakabanda', 'Nyamirambo', 'Nyarugenge', 'Rwezamenyo'],
};

const BUSINESS_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'company', label: 'Company' },
  { value: 'partnership', label: 'Partnership' },
];

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    businessData: {
      name: '',
      registrationNumber: '',
      tin: '',
      businessType: 'individual',
      address: {
        province: '',
        district: '',
        sector: '',
        cell: '',
      },
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const districts = formData.businessData.address.province
    ? DISTRICTS_MAP[formData.businessData.address.province] || []
    : [];
  const sectors = formData.businessData.address.district
    ? SECTORS_MAP[formData.businessData.address.district] || []
    : [];

  const updateAddress = (field, value) => {
    const addr = { ...formData.businessData.address, [field]: value };
    if (field === 'province') { addr.district = ''; addr.sector = ''; }
    if (field === 'district') { addr.sector = ''; }
    setFormData({ ...formData, businessData: { ...formData.businessData, address: addr } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t('errors.password_mismatch'));
      return;
    }
    if (!formData.businessData.address.province || !formData.businessData.address.district || !formData.businessData.address.sector) {
      alert('Please select your business location (Province, District, and Sector)');
      return;
    }

    setIsLoading(true);
    const result = await register({
      ...formData,
      role: 'business_owner',
    });
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-white font-bold text-2xl">ST</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t('auth.register')}</h1>
          <p className="text-gray-600 text-sm">Create your SmartTax account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          {/* Personal Information */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="0788XXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" required />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Business Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Business Name</label>
                <input type="text" value={formData.businessData.name} onChange={(e) => setFormData({...formData, businessData: {...formData.businessData, name: e.target.value}})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">TIN / Registration Number</label>
                <input type="text" value={formData.businessData.tin} onChange={(e) => setFormData({...formData, businessData: {...formData.businessData, tin: e.target.value}})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" required />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Business Type</label>
                <select value={formData.businessData.businessType} onChange={(e) => setFormData({...formData, businessData: {...formData.businessData, businessType: e.target.value}})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white">
                  {BUSINESS_TYPES.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Business Location */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
              Business Location <span className="text-red-500">*</span>
            </h2>
            <p className="text-xs text-gray-500 mb-3">Your sector admin will approve your business based on this location.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Province</label>
                <select value={formData.businessData.address.province}
                  onChange={(e) => updateAddress('province', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white" required>
                  <option value="">Select Province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">District</label>
                <select value={formData.businessData.address.district}
                  onChange={(e) => updateAddress('district', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                  required disabled={!formData.businessData.address.province}>
                  <option value="">Select District</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Sector</label>
                <select value={formData.businessData.address.sector}
                  onChange={(e) => updateAddress('sector', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                  required disabled={!formData.businessData.address.district}>
                  <option value="">Select Sector</option>
                  {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Security</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm pr-12" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" required />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-green-600 text-sm hover:underline font-medium">
              Already have an account? Sign in
            </Link>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            By registering, you agree to SmartTax terms of service. Your business will be reviewed by the sector admin.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
