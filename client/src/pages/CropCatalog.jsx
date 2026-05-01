import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Leaf, ThermometerSun, Droplets, Ruler, Loader2, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/useLanguage';

const toTitleCase = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

export default function CropCatalog() {
  const { catalogSearch = '' } = useOutletContext() || {};
  const { t } = useLanguage();

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedCropDetails, setSelectedCropDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/crops?limit=300');
        if (mounted) setCrops(res.data?.crops || res.data || []);
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || t('catalog.loadError'));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCrops();
    return () => {
      mounted = false;
    };
  }, [t]);

  const filteredCrops = useMemo(() => {
    const query = catalogSearch.trim().toLowerCase();
    if (!query) return crops;

    return crops.filter((crop) => {
      const name = crop.crop_name?.toLowerCase() || '';
      const variety = crop.variety?.toLowerCase() || '';
      const soil = Array.isArray(crop.soil_type) ? crop.soil_type.join(' ').toLowerCase() : '';
      return name.includes(query) || variety.includes(query) || soil.includes(query);
    });
  }, [catalogSearch, crops]);

  const openCropDetails = async (crop) => {
    setSelectedCrop(crop);
    setSelectedCropDetails(null);
    setDetailsError('');
    setLoadingDetails(true);

    try {
      const res = await api.get(`/api/crops/${encodeURIComponent(crop.crop_name)}`);
      setSelectedCropDetails(res.data?.crop || null);
    } catch (err) {
      setDetailsError(err.response?.data?.message || t('catalog.detailsError'));
      setSelectedCropDetails(crop);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeCropDetails = () => {
    setSelectedCrop(null);
    setSelectedCropDetails(null);
    setDetailsError('');
  };

  const activeCrop = selectedCropDetails || selectedCrop;
  const activeStages = activeCrop?.lifecycle_stages || [];

  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">{t('catalog.title')}</h1>
        <p className="text-stone-500 mt-2">{t('catalog.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      ) : filteredCrops.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">{t('catalog.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCrops.map((crop) => (
            <motion.button
              key={crop._id}
              onClick={() => openCropDetails(crop)}
              whileHover={{ y: -2 }}
              className="text-left p-5 bg-[var(--color-surface)] border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-800 capitalize">{crop.crop_name || '-'}</h3>
                  <p className="text-xs font-semibold text-stone-500">{crop.variety || t('catalog.defaultVariety')}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-stone-600">
                  <span className="font-bold">{t('catalog.soil')}:</span>{' '}
                  {Array.isArray(crop.soil_type) && crop.soil_type.length > 0
                    ? crop.soil_type.map((soil) => toTitleCase(soil)).join(', ')
                    : '-'}
                </p>
                <p className="text-stone-600">
                  <span className="font-bold">{t('catalog.stages')}:</span> {t('catalog.tapToLoadStages')}
                </p>
                <p className="text-[var(--color-primary)] text-sm font-bold mt-2">{t('catalog.viewDetails')}</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeCropDetails}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="bg-[var(--color-surface)] w-full max-w-4xl rounded-2xl border border-gray-100 shadow-xl max-h-[88vh] overflow-y-auto"
            >
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-stone-800 capitalize">
                    {activeCrop?.crop_name || '-'}
                  </h2>
                  <p className="text-sm text-stone-500">{activeCrop?.variety || t('catalog.defaultVariety')}</p>
                </div>
                <button onClick={closeCropDetails} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-5">
                {loadingDetails && (
                  <div className="mb-5 flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('catalog.loadingDetails')}
                  </div>
                )}
                {detailsError && (
                  <div className="mb-5 p-3 bg-amber-50 border border-amber-100 text-amber-700 text-sm font-medium rounded-lg">
                    {detailsError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InfoCard
                    icon={Leaf}
                    label={t('catalog.soil')}
                    value={
                      Array.isArray(activeCrop?.soil_type) && activeCrop.soil_type.length > 0
                        ? activeCrop.soil_type.map((soil) => toTitleCase(soil)).join(', ')
                        : '-'
                    }
                  />
                  <InfoCard
                    icon={Sprout}
                    label={t('catalog.totalStages')}
                    value={`${activeStages.length || 0}`}
                  />
                  <InfoCard icon={Leaf} label={t('catalog.region')} value={activeCrop?.region || '-'} />
                  <InfoCard
                    icon={ThermometerSun}
                    label={t('catalog.favorableWeather')}
                    value={activeCrop?.favorable_weather || '-'}
                  />
                  <InfoCard
                    icon={Droplets}
                    label={t('catalog.sowingMonths')}
                    value={
                      Array.isArray(activeCrop?.sowing_months) && activeCrop.sowing_months.length > 0
                        ? activeCrop.sowing_months.join(', ')
                        : '-'
                    }
                  />
                </div>

                <h3 className="text-lg font-bold text-stone-800 mb-4">{t('catalog.stagesAndConditions')}</h3>
                {activeStages.length === 0 ? (
                  <div className="p-5 rounded-xl border border-gray-100 text-sm font-medium text-gray-500 bg-white">
                    {t('catalog.noStageData')}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeStages.map((stage, index) => (
                    <div key={`${stage.stage_name}-${index}`} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h4 className="font-bold text-stone-800 capitalize">
                          {index + 1}. {stage.stage_name || t('catalog.stage')}
                        </h4>
                        <span className="text-xs font-semibold bg-green-50 text-[var(--color-primary)] px-2 py-1 rounded-full">
                          {t('catalog.daysRange')} {stage.day_start ?? '-'} - {stage.day_end ?? '-'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <ConditionCard
                          icon={ThermometerSun}
                          label={t('catalog.temperature')}
                          value={`${stage.ideal_conditions?.min_temp ?? '-'}°C - ${stage.ideal_conditions?.max_temp ?? '-'}°C`}
                        />
                        <ConditionCard
                          icon={Droplets}
                          label={t('catalog.watering')}
                          value={`${t('catalog.maxDryDays')} ${stage.ideal_conditions?.max_days_without_water ?? '-'}`}
                        />
                        <ConditionCard
                          icon={Ruler}
                          label={t('catalog.expectedHeight')}
                          value={`${stage.expected_growth?.min_height_cm ?? '-'}cm - ${stage.expected_growth?.max_height_cm ?? '-'}cm`}
                        />
                      </div>
                    </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[var(--color-primary)]" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <p className="text-sm font-bold text-stone-800 mt-1">{value}</p>
      </div>
    </div>
  );
}

function ConditionCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-4 h-4 text-[var(--color-primary)]" />
        <p className="text-[11px] font-semibold text-gray-500 uppercase">{label}</p>
      </div>
      <p className="text-sm font-bold text-stone-800">{value}</p>
    </div>
  );
}
