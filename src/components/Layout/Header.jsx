// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, LogOut, Globe } from 'lucide-react';
import LanguageSwitcher from '../Common/LanguageSwitcher';
import NotificationBell from '../Notifications/NotificationBell';

const Header = () => {
  const { user, token, logout } = useAuthStore();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-green-600 text-white sticky top-0 z-50 shadow-md">
        <div className="px-4 mx-auto max-w-md flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">ST</span>
            </div>
            <h1 className="text-lg font-semibold">SmartTax</h1>
          </div>
          
          <div className="flex items-center gap-1">
            <NotificationBell userId={user?.id || user?._id} token={token} />
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-14 right-0 w-64 bg-white rounded-lg shadow-lg m-2 z-50" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;