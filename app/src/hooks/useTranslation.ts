import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/translations';

export function useTranslation() {
  const { lang } = useLanguage();

  const t = (key: keyof typeof translations) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] ?? entry.zh ?? key;
  };

  return { t, lang };
}
