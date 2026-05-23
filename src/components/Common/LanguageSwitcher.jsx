import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import api from '../../services/api';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const changeLanguage = async (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    try {
      await api.patch('/auth/preferred-language', { language: langCode });
    } catch (e) {
      console.warn('Failed to sync preferred language to server:', e.message);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500 hover:bg-green-700 transition">
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLanguage.flag}</span>
      </button>
      <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg hidden group-hover:block z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${
              i18n.language === lang.code ? 'bg-green-50 text-green-600' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;