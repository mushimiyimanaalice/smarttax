import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        set({ theme: next });
      },
      initTheme: () => {
        const saved = get().theme || 'light';
        document.documentElement.setAttribute('data-theme', saved);
      },
    }),
    { name: 'theme-storage' }
  )
);
