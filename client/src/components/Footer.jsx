import { Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-green-800" />
          <span className="text-lg font-bold text-slate-800 tracking-tight">AgroSense</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
          <Link to="#" className="hover:text-slate-800 transition-colors">{t('footer.privacy')}</Link>
          <Link to="#" className="hover:text-slate-800 transition-colors">{t('footer.terms')}</Link>
          <Link to="#" className="hover:text-slate-800 transition-colors">{t('footer.support')}</Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} AgroSense. {t('footer.rights')}
        </p>

      </div>
    </footer>
  );
}
