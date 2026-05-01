import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThermometerSun, Droplet, Info, AlertTriangle, Ruler, Sprout } from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../context/useLanguage';

export default function FieldAlertsPanel({ initialNotifications, crops = [], onOpenDiagnostics }) {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [loadingId, setLoadingId] = useState(null);

  // Sync state when polling updates the parent's props
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const handleLogWater = async (e, notificationId, fieldId) => {
    e.stopPropagation();
    // Optimistic Update: Remove the notification immediately
    setNotifications((prev) => prev.filter(n => n._id !== notificationId));
    setLoadingId(notificationId);

    try {
      await api.put(`/api/fields/${fieldId}/log-action`, { actionType: 'WATER' });
    } catch (error) {
      console.error("Failed to log water:", error);
      // Revert if failed (simple rollback logic)
      const revertedNotification = initialNotifications.find(n => n._id === notificationId);
      if (revertedNotification) {
        setNotifications((prev) => [revertedNotification, ...prev]);
      }
    } finally {
      setLoadingId(null);
    }
  };

  // Generate dynamic alerts for specific metrics showing stress/warning
  const dynamicAlerts = crops
    .filter(crop => crop.status && crop.status !== 'Optimal')
    .flatMap(crop => {
      if (crop.report_metrics) {
        const issues = crop.report_metrics.filter(m => m.status === 'STRESS' || m.status === 'WARNING');
        if (issues.length > 0) {
          return issues.map(issue => ({
            _id: `dynamic-${crop._id}-${issue.key}`,
            type: issue.status,
            title: `${crop.cropProfileId?.crop_name || 'Crop'} - ${issue.label} Alert`,
            message: issue.message || `The ${issue.label.toLowerCase()} is out of range.`,
            fieldId: crop._id,
            field: crop,
            isDynamic: true,
            key: issue.key
          }));
        }
      }
      
      const isStress = crop.status.toLowerCase() === 'stress';
      return [{
        _id: `dynamic-${crop._id}`,
        type: isStress ? 'STRESS' : 'WARNING',
        title: `${crop.cropProfileId?.crop_name || 'Crop'} Needs Attention`,
        message: `Current status is ${crop.status}. Click here to open the diagnostic report and view actionable metrics.`,
        fieldId: crop._id,
        field: crop,
        isDynamic: true
      }];
    });

  const allNotifications = [...notifications, ...dynamicAlerts];

  return (
    <div className="w-full md:w-80 shrink-0 md:bg-[var(--color-surface)] md:border md:border-gray-100 md:rounded-2xl md:p-5 h-fit">
      
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xs md:text-lg font-extrabold text-gray-500 md:text-gray-800 uppercase md:capitalize tracking-wider md:tracking-tight flex items-center gap-2">
          <span className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-green-50">
            <span className="w-3 h-3 bg-[var(--color-secondary)] rounded-full animate-pulse"></span>
          </span>
          {t('dashboard.fieldAlerts')}
        </h2>
        {allNotifications.length > 0 && (
          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {allNotifications.length} {t('dashboard.active')}
          </span>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {allNotifications.map((notif) => {
            const isWarning = notif.type === 'WARNING';
            const isStress = notif.type === 'STRESS';
            
            return (
               <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                onClick={() => {
                  if (onOpenDiagnostics) {
                    const targetField = notif.field || crops.find(c => c._id === notif.fieldId);
                    if (targetField) {
                      onOpenDiagnostics(targetField);
                    }
                  }
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                  isStress 
                    ? 'bg-[#FEF2F2] border-[#FECACA] shadow-[0_4px_12px_-4px_rgba(239,68,68,0.2)]'
                    : isWarning 
                    ? 'bg-[#FFF9E6] border-[#FDE68A] shadow-[0_4px_12px_-4px_rgba(251,191,36,0.2)]' 
                    : 'bg-gray-50 border-gray-100 hover:border-[var(--color-primary)]'
                }`}
              >
                <div className="flex gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isStress ? 'bg-red-100 text-red-600' : isWarning ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-gray-200 text-gray-500'}`}>
                    {notif.key === 'temperature' ? <ThermometerSun className="w-4 h-4" /> 
                      : notif.key === 'water' ? <Droplet className="w-4 h-4" /> 
                      : notif.key === 'height' ? <Ruler className="w-4 h-4" /> 
                      : notif.key === 'stage' ? <Sprout className="w-4 h-4" />
                      : isStress ? <AlertTriangle className="w-4 h-4" /> 
                      : <Info className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 leading-tight">{notif.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {notif.field ? (notif.field.location?.city || 'Main Field') : 'North Sector'} • {t('dashboard.clickForDiagnostics')}
                    </p>
                  </div>
                </div>
                
                <p className={`text-xs leading-relaxed ${!isWarning && !isStress && 'mb-4'} ${isStress ? 'text-red-700' : isWarning ? 'text-[#B45309]' : 'text-gray-500'}`}>
                  {notif.message}
                </p>

                {isWarning && !notif.isDynamic && (
                  <button 
                    onClick={(e) => handleLogWater(e, notif._id, notif.fieldId)}
                    disabled={loadingId === notif._id}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    <Droplet className="w-4 h-4" /> 
                    {loadingId === notif._id ? t('dashboard.logging') : t('dashboard.logWater')}
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {allNotifications.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">{t('dashboard.noAlerts')}</p>
        )}
      </div>
    </div>
  );
}
