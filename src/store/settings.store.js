import { create } from 'zustand';
import i18n from '../i18n';

const SETTINGS_KEY = 'scorecard:settings';

function load() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { theme: 'light', language: 'en', fontSize: 'small' };
  } catch {
    return { theme: 'light', language: 'en', fontSize: 'small' };
  }
}

function save(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function applyLanguage(language) {
  i18n.changeLanguage(language);
}

function applyFontSize(fontSize) {
  if (fontSize === 'medium' || fontSize === 'large') {
    document.documentElement.setAttribute('data-font-size', fontSize);
  } else {
    document.documentElement.removeAttribute('data-font-size');
  }
}

const initial = load();
// Apply persisted settings immediately on module load
applyTheme(initial.theme);
applyLanguage(initial.language);
applyFontSize(initial.fontSize);

export const useSettingsStore = create((set, get) => ({
  theme: initial.theme,
  language: initial.language,
  fontSize: initial.fontSize ?? 'small',

  setTheme: (theme) => {
    applyTheme(theme);
    save({ ...get(), theme });
    set({ theme });
  },

  setLanguage: (language) => {
    applyLanguage(language);
    save({ ...get(), language });
    set({ language });
  },

  setFontSize: (fontSize) => {
    applyFontSize(fontSize);
    save({ ...get(), fontSize });
    set({ fontSize });
  },
}));
