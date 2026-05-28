import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Save, LogOut, User, Mail, Phone, MapPin, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const initials = (user?.fullName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const gradientAvatar = {
    background: 'linear-gradient(135deg, #003DA5 0%, #00A551 50%, #FAD201 100%)',
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const { data } = await api.put('/admin/profile', {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
      });
      updateUser(data);
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fields = [
    { key: 'fullName', label: 'Full Name', icon: User, type: 'text' },
    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', disabled: true },
    { key: 'phoneNumber', label: 'Phone Number', icon: Phone, type: 'tel' },
    { key: 'address', label: 'Address', icon: MapPin, type: 'text' },
  ];

  const msgStyles = {
    success: { background: '#00A55115', color: '#00A551', border: '1px solid #00A55130' },
    error: { background: '#dc262615', color: '#dc2626', border: '1px solid #dc262630' },
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 4px' }}>
      {message.text && (
        <div
          style={{
            ...msgStyles[message.type],
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 16,
          }}
        >
          <BadgeCheck size={18} />
          {message.text}
        </div>
      )}

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            padding: '28px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div
            style={{
              ...gradientAvatar,
              width: 72,
              height: 72,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              boxShadow: '0 4px 14px rgba(0,61,165,0.3)',
            }}
          >
            {initials}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {user?.fullName}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map(({ key, label, icon: Icon, type, disabled }) => (
              <div key={key}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}
                >
                  {label}
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: disabled ? 'var(--bg-card)' : 'var(--bg-input)',
                    border: `1px solid ${disabled ? 'var(--border-color)' : 'var(--border-color)'}`,
                    borderRadius: 12,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 44,
                      minHeight: 44,
                      color: '#003DA5',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </span>
                  <input
                    type={type}
                    value={form[key]}
                    disabled={disabled}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      paddingRight: 12,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.parentElement.style.borderColor = '#003DA5';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.parentElement.style.borderColor = 'var(--border-color)';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%',
              minHeight: 48,
              marginTop: 24,
              background: 'linear-gradient(135deg, #003DA5 0%, #00A551 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
              transition: 'opacity 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          minHeight: 48,
          background: 'var(--bg-card)',
          border: '1px solid #dc262640',
          borderRadius: 12,
          color: '#dc2626',
          fontSize: 15,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#dc262610';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--bg-card)';
        }}
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Profile;
