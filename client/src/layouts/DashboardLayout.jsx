import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Tractor, Settings, Search, Sun, CloudRain, Cloud, CloudLightning, CloudSnow, Loader2, Menu, UserCircle, MapPin, Ruler, LogOut, Sprout } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/useLanguage';
import { useAuth } from '../context/AuthContext';

const getWeatherIcon = (description) => {
  const desc = description?.toLowerCase() || '';
  if (desc.includes('rain') || desc.includes('drizzle')) return CloudRain;
  if (desc.includes('thunderstorm')) return CloudLightning;
  if (desc.includes('snow')) return CloudSnow;
  if (desc.includes('cloud')) return Cloud;
  return Sun;
};

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const isCatalogPage = location.pathname.startsWith('/catalog');
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const sidebarItems = [
    { label: t('sidebar.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('sidebar.cropCatalog'), path: '/catalog', icon: BookOpen },
    { label: t('sidebar.fields'), path: '/fields', icon: Tractor },
    { label: t('sidebar.settings'), path: '/settings', icon: Settings },
  ];

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [farmProfile, setFarmProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        const response = await api.get('/api/weather/current');
        if (isMounted) setWeather(response.data.weather);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        if (isMounted) setLoadingWeather(false);
      }
    };
    fetchWeather();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchFarmProfile = async () => {
      try {
        const response = await api.get('/api/farms/me');
        if (isMounted) setFarmProfile(response.data?.farm || null);
      } catch (error) {
        if (isMounted) setFarmProfile(null);
      }
    };
    fetchFarmProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
  };

  const WeatherIcon = weather ? getWeatherIcon(weather.description) : Sun;

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-neutral-base)] flex flex-col md:flex-row">
      
      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <span className="text-xl font-bold text-[var(--color-primary)]">AgroSense</span>
        </div>
        <button onClick={() => setProfileOpen((prev) => !prev)}>
          <UserCircle className="w-6 h-6 text-gray-700" />
        </button>

        {profileOpen && (
          <div className="absolute right-3 top-14 w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-4 z-50">
            <h3 className="text-sm font-extrabold text-stone-800 mb-3">User Profile</h3>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-stone-600">
                <UserCircle className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="font-semibold text-stone-700">Username:</span>
                <span>{user?.username || user?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Sprout className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="font-semibold text-stone-700">Farm Name:</span>
                <span>{farmProfile?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="font-semibold text-stone-700">Location:</span>
                <span>
                  {farmProfile?.location?.city && farmProfile?.location?.state
                    ? `${farmProfile.location.city}, ${farmProfile.location.state}`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Ruler className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="font-semibold text-stone-700">Farm Size:</span>
                <span>{farmProfile?.size ? `${farmProfile.size} ${farmProfile?.size_unit || ''}`.trim() : 'N/A'}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-700 border border-red-100 py-2.5 text-sm font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[var(--color-surface)] border-r border-gray-100 min-h-screen sticky top-0">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold text-[var(--color-primary)] tracking-tight">AgroSense</h1>
          <p className="text-xs font-medium text-gray-400 mt-1">{t('common.precisionAgriculture')}</p>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                  isActive
                    ? 'bg-[var(--color-background)] text-[var(--color-primary)] border border-green-100/50 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-secondary)]' : 'text-gray-400'}`} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen relative pb-16 md:pb-0">
        
        {/* DESKTOP HEADER */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-[var(--color-background)] sticky top-0 z-40">
          {isCatalogPage ? (
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(event) => setCatalogSearch(event.target.value)}
                placeholder={t('header.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-200/40 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/30 transition-all text-gray-700"
              />
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-6 relative">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              {loadingWeather ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="w-16 h-4 bg-gray-200 animate-pulse rounded"></span>
                </div>
              ) : weather ? (
                <>
                  <WeatherIcon className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="capitalize">{Math.round(weather.current_temp)}°C {weather.description}</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">{t('common.weatherUnavailable')}</span>
                </>
              )}
            </div>

            <button onClick={() => setProfileOpen((prev) => !prev)}>
              <UserCircle className="w-6 h-6 text-gray-600 hover:text-[var(--color-primary)] transition-colors" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-4 z-50">
                <h3 className="text-sm font-extrabold text-stone-800 mb-3">User Profile</h3>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-stone-600">
                    <UserCircle className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="font-semibold text-stone-700">Username:</span>
                    <span>{user?.username || user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Sprout className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="font-semibold text-stone-700">Farm Name:</span>
                    <span>{farmProfile?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="font-semibold text-stone-700">Location:</span>
                    <span>
                      {farmProfile?.location?.city && farmProfile?.location?.state
                        ? `${farmProfile.location.city}, ${farmProfile.location.state}`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Ruler className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="font-semibold text-stone-700">Farm Size:</span>
                    <span>
                      {farmProfile?.size ? `${farmProfile.size} ${farmProfile?.size_unit || ''}`.trim() : 'N/A'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-700 border border-red-100 py-2.5 text-sm font-bold hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* OUTLET */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet context={{ weather, catalogSearch }} />
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-gray-100 flex items-center justify-around pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 py-3 px-2"
            >
              <div className={`p-1.5 rounded-full ${isActive ? 'bg-[var(--color-background)]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
              </div>
              <span className={`text-[10px] font-semibold ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

    </div>
  );
}
