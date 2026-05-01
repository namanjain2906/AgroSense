import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useOutletContext } from 'react-router-dom';
import ActiveCropsGrid from '../components/dashboard/ActiveCropsGrid';
import FieldAlertsPanel from '../components/dashboard/FieldAlertsPanel';
import EnvironmentalSnapshot from '../components/dashboard/EnvironmentalSnapshot';
import AddCropModal from '../components/dashboard/AddCropModal';
import DiagnosticsModal from '../components/dashboard/DiagnosticsModal';
import { Sprout, MapPin, Ruler, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    <div className="flex gap-4">
      <div className="h-24 bg-gray-200 rounded-2xl w-1/2"></div>
      <div className="h-24 bg-gray-200 rounded-2xl w-1/2"></div>
    </div>
    <div className="h-8 bg-gray-200 w-48 rounded mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-64 bg-gray-200 rounded-2xl"></div>
      <div className="h-64 bg-gray-200 rounded-2xl"></div>
    </div>
  </div>
);

export default function Dashboard() {
  const { t } = useLanguage();
  const { weather } = useOutletContext() || {};
  const [crops, setCrops] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [farmData, setFarmData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [selectedDiagnosticsField, setSelectedDiagnosticsField] = useState(null);

  // Onboarding Form State
  const [formData, setFormData] = useState({
    name: '',
    locationCity: '',
    locationState: '',
    size: '',
    soil_type: 'Loam'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardError, setOnboardError] = useState('');

  const fetchDashboardData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      // 1. Check for Farm Profile (Mandatory Checkpoint)
      let farmResponse = null;
      try {
        farmResponse = await api.get('/api/farms/me');
        setFarmData(farmResponse.data.farm);
      } catch (err) {
        if (err.response?.status === 404) {
          setFarmData(null);
          if (showLoader) setLoading(false);
          return;
        }
        throw err;
      }

      // Case A: Farm Found - Proceed to fetch crops and notifications
      const [fieldsRes, notifRes] = await Promise.all([
        api.get('/api/fields?active=true').catch(() => ({ data: [] })), 
        api.get('/api/notifications?unreadOnly=true').catch(() => ({ data: { notifications: [] } }))
      ]);

      setCrops(fieldsRes.data?.fields || fieldsRes.data || []);
      setNotifications(notifRes.data?.notifications || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Unable to load dashboard data. Please try again later.");
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Polling for Notifications every 60 seconds (Only if farm exists)
  useEffect(() => {
    if (!farmData) return;

    const fetchNotifications = async () => {
      try {
        const notifRes = await api.get('/api/notifications?unreadOnly=true');
        setNotifications(notifRes.data?.notifications || []);
      } catch (error) {
        console.error("Failed to poll notifications:", error);
      }
    };

    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, [farmData]);

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOnboardError('');

    try {
      // Map to backend expected payload
      const payload = {
        name: formData.name,
        location: {
          city: formData.locationCity,
          state: formData.locationState,
        },
        size: Number(formData.size),
        size_unit: 'acre',
        soil_type: formData.soil_type
      };

      const response = await api.post('/api/farms', payload);
      setFarmData(response.data.farm);
      
      // Now fetch the fields/notifications
      const [fieldsRes, notifRes] = await Promise.all([
        api.get('/api/fields?active=true').catch(() => ({ data: [] })), 
        api.get('/api/notifications?unreadOnly=true').catch(() => ({ data: { notifications: [] } }))
      ]);

      setCrops(fieldsRes.data?.fields || fieldsRes.data || []);
      setNotifications(notifRes.data?.notifications || []);

    } catch (err) {
      setOnboardError(err.response?.data?.message || 'Failed to save farm details. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    out: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  // --- RENDER: Mandatory Onboarding State ---
  if (!loading && !farmData && !error) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="max-w-3xl mx-auto h-full flex flex-col pt-8 pb-16 px-4"
      >
        <div className="bg-[var(--color-surface)] p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-green-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
              <Sprout className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Welcome to AgroSense.</h1>
              <p className="text-sm font-medium text-[var(--color-primary)]">Let's personalize your dashboard.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-8">
            <p className="text-sm text-gray-600 leading-relaxed">
              Before you can view insights and log active crops, you must provide your primary farm details. This information is mandatory to calculate tailored weather and soil insights for your exact location and acreage.
            </p>
          </div>

          {onboardError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-lg text-center">
              {onboardError}
            </div>
          )}

          <form onSubmit={handleOnboardingSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Farm Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                placeholder="e.g. Green Valley Estates"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.locationCity}
                    onChange={(e) => setFormData({...formData, locationCity: e.target.value})}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                    placeholder="City"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">State/Province</label>
                <input
                  type="text"
                  required
                  value={formData.locationState}
                  onChange={(e) => setFormData({...formData, locationState: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Farm Size (Acres)</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    required
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                    placeholder="Size"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Soil Type</label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => setFormData({...formData, soil_type: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
                >
                  <option value="Loam">Loam</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Silt">Silt</option>
                  <option value="Peat">Peat</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[#20401b] text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md mt-4 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Save Mandatory Farm Details
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  // --- RENDER: Full Dashboard State ---
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="max-w-6xl mx-auto h-full flex flex-col md:flex-row gap-8"
    >
      {/* LEFT CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile ONLY Environment Snapshot */}
        <EnvironmentalSnapshot />

        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>
        ) : (
          <>
            {/* Display Farm Details Summary */}
            {farmData && (
              <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{farmData.name.split(" ")[0].charAt(0).toUpperCase()+farmData.name.split(" ")[0].slice(1).toLowerCase() + " " + farmData.name.split(" ")[1].charAt(0).toUpperCase()+farmData.name.split(" ")[1].slice(1).toLowerCase()}</h1>
                  <p className="text-sm text-gray-500 font-medium">
                    {farmData.location?.city ? farmData.location.city[0].toUpperCase() + farmData.location.city.slice(1).toLowerCase() : 'City'}, {farmData.location?.state  ? farmData.location.state[0].toUpperCase() + farmData.location.state.slice(1).toLowerCase().split(' ')[0] + ' ' + farmData.location.state.slice(1).toLowerCase().split(' ')[1].charAt(0).toUpperCase() + farmData.location.state.slice(1).toLowerCase().split(' ')[1].slice(1): 'State'} • {farmData.size} {farmData.size_unit}s • {farmData.soil_type ? farmData.soil_type[0].toUpperCase() + farmData.soil_type.slice(1).toLowerCase() : 'Soil'} Soil
                  </p>
                </div>
              </div>
            )}

            {crops.length > 0 ? (
              <ActiveCropsGrid 
                crops={crops} 
                weather={weather}
                onAddCrop={() => setIsAddCropModalOpen(true)}
                onRefetch={() => fetchDashboardData(false)}
              />
            ) : (
              <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-dashed border-gray-300">
                <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 mb-1">{t('dashboard.noActiveCropsTitle')}</h3>
                <p className="text-gray-500 font-medium text-sm mb-4 max-w-sm mx-auto">
                  {t('dashboard.noActiveCropsDesc')}
                </p>
                <button 
                  onClick={() => setIsAddCropModalOpen(true)}
                  className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#20401b] transition-colors"
                >
                  {t('dashboard.addFirstCrop')}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* RIGHT SIDEBAR (Desktop) / STACKED (Mobile) */}
      <div className="w-full md:w-auto">
        {loading ? (
          <div className="animate-pulse h-80 w-full md:w-80 bg-gray-200 rounded-2xl"></div>
        ) : (
          farmData && (
            <FieldAlertsPanel 
              initialNotifications={notifications} 
              crops={crops} 
              onOpenDiagnostics={(field) => setSelectedDiagnosticsField(field)} 
            />
          )
        )}
      </div>

      <AddCropModal 
        isOpen={isAddCropModalOpen}
        onClose={() => setIsAddCropModalOpen(false)}
        onSuccess={() => fetchDashboardData(true)}
        farmLocation={farmData?.location}
      />

      {selectedDiagnosticsField && (
        <DiagnosticsModal 
          field={selectedDiagnosticsField} 
          isOpen={!!selectedDiagnosticsField} 
          onClose={() => setSelectedDiagnosticsField(null)} 
          onRefetch={() => fetchDashboardData(false)} 
        />
      )}
    </motion.div>
  );
}
