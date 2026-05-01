import { createContext, useState } from 'react';
import { translations } from '../locales/translations';

export const LanguageContext = createContext(null);
const STORAGE_KEY = 'agrosense-language';

const getStoredLanguage = () => {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'hi' ? 'hi' : 'en';
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getStoredLanguage);

  const changeLanguage = (nextLanguage) => {
    const normalized = nextLanguage === 'hi' ? 'hi' : 'en';
    localStorage.setItem(STORAGE_KEY, normalized);
    setLanguage(normalized);
  };

  const t = (key) => {
    const path = key.split('.');
    const fallback = path.reduce((acc, segment) => acc?.[segment], translations.en);
    const localized = path.reduce((acc, segment) => acc?.[segment], translations[language]);
    return localized ?? fallback ?? key;
  };

  const value = {
    language,
    changeLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
