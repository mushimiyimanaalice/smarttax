import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import api from '../../services/api';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const changeLanguage = async (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    setOpen(false);
    try {
      await api.patch('/auth/preferred-language', { language: langCode });
    } catch (e) { console.warn('Failed to sync language:', e.message); }
  };

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/20 active:scale-95"
        style={{ color: 'var(--text-primary)' }}
      >
        <Globe className="w-4 h-4" />
        <span>{current.flag}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl shadow-2xl border overflow-hidden z-50"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 hover:bg-green-50 first:pt-3 last:pb-3"
              style={{
                color: i18n.language === lang.code ? '#00A551' : 'var(--text-primary)',
                background: i18n.language === lang.code ? 'rgba(0,165,81,0.06)' : 'transparent',
              }}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1 text-left font-medium">{lang.name}</span>
              {i18n.language === lang.code && <Check className="w-4 h-4" style={{ color: '#00A551' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
