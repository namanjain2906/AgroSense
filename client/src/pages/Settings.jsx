import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function Settings() {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">{t('dashboard.settingsTitle')}</h1>
        <p className="text-stone-500 mt-2">{t('dashboard.settingsSubtitle')}</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-[var(--color-primary)]" />
          </div>

          <div className="flex-1">
            <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dashboard.languageLabel')}
            </label>
            <select
              id="language"
              value={language}
              onChange={(event) => changeLanguage(event.target.value)}
              className="w-full md:w-72 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            >
              <option value="en">{t('common.english')}</option>
              <option value="hi">{t('common.hindi')}</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">{t('dashboard.languageHelp')}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
