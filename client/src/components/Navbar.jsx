import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function Navbar() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <nav className="flex items-center justify-between px-6 py-6 lg:px-12 w-full max-w-7xl mx-auto relative z-50">
      <div className="flex items-center gap-2">
        <Sprout className="w-6 h-6 text-green-800" />
        <span className="text-xl font-bold text-slate-800 tracking-tight">AgroSense</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
        <a href="#features" className="hover:text-gray-900 transition-colors">{t('nav.features')}</a>
        <a href="#database" className="hover:text-gray-900 transition-colors">{t('nav.cropDatabase')}</a>
        <a href="#how-it-works" className="hover:text-gray-900 transition-colors">{t('nav.howItWorks')}</a>
      </div>

      <div className="flex items-center gap-4">
        {/* Backend Context:
            Clicking this will navigate to the /login route.
            Upon successful authentication, the backend will return a JWT token.
            This token should be stored (e.g., in localStorage or context), and the user
            should be redirected to the protected /dashboard route.
            The dashboard will rely on endpoints like GET /api/fields/status.
        */}
        <button 
          onClick={() => navigate('/login')}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors cursor-pointer"
        >
          {t('nav.login')}
        </button>
        <button 
          onClick={() => navigate('/register')}
          className="text-sm font-medium bg-[#143d25] text-white px-5 py-2.5 rounded-md hover:bg-[#0f2d1b] transition-colors shadow-sm cursor-pointer"
        >
          {t('nav.signupFree')}
        </button>
      </div>
    </nav>
  );
}
