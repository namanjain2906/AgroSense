import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Search, Loader2, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../context/useLanguage';

export default function AddCropModal({ isOpen, onClose, onSuccess, farmLocation }) {
  const { t } = useLanguage();
  const [cropsList, setCropsList] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  
  const [formData, setFormData] = useState({
    cropProfileId: '',
    sowing_date: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Fetch crop catalog
  useEffect(() => {
    if (!isOpen) return;

    const fetchCrops = async () => {
      try {
        setLoadingCrops(true);
        const res = await api.get('/api/crops?limit=100');
        const crops = res.data?.crops || res.data || [];
        setCropsList(crops);
      } catch (err) {
        console.error("Failed to fetch crops:", err);
      } finally {
        setLoadingCrops(false);
      }
    };
    fetchCrops();
  }, [isOpen]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.cropProfileId || !formData.sowing_date) {
      setError("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/fields', {
        cropProfileId: formData.cropProfileId,
        sowing_date: formData.sowing_date,
        location: farmLocation || { name: 'Farm Location' }
      });
      
      // Reset and close
      setFormData({ cropProfileId: '', sowing_date: '' });
      setSearchQuery('');
      onSuccess(); // Trigger dashboard refetch
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add crop.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  
  const filteredCrops = cropsList.filter(c => 
    c.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.variety && c.variety.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedCrop = cropsList.find(c => c._id === formData.cropProfileId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[var(--color-surface)] w-full max-w-md rounded-2xl shadow-xl overflow-visible"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">{t('dashboard.addCrop')}</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="relative z-20">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Crop Type</label>
                <div className="relative" ref={dropdownRef}>
                  {/* Custom Dropdown Trigger */}
                  <div 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`w-full pl-9 pr-10 py-3 bg-gray-50 border rounded-xl text-sm transition-all cursor-pointer flex items-center min-h-[46px] ${dropdownOpen ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30' : 'border-gray-200'}`}
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    
                    {dropdownOpen ? (
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type to search..."
                        className="w-full bg-transparent focus:outline-none"
                      />
                    ) : (
                      <span className={selectedCrop ? "text-gray-900" : "text-gray-400"}>
                        {loadingCrops ? 'Loading crops...' : selectedCrop ? `${selectedCrop.crop_name} ${selectedCrop.variety ? `(${selectedCrop.variety})` : ''}` : 'Select a crop...'}
                      </span>
                    )}

                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 shadow-xl rounded-xl max-h-60 overflow-y-auto z-50 py-1"
                      >
                        {filteredCrops.length > 0 ? (
                          filteredCrops.map((c) => (
                            <div
                              key={c._id}
                              onClick={() => {
                                setFormData({ ...formData, cropProfileId: c._id });
                                setSearchQuery('');
                                setDropdownOpen(false);
                              }}
                              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-green-50 transition-colors ${formData.cropProfileId === c._id ? 'bg-green-50 text-[var(--color-primary)] font-semibold' : 'text-gray-700'}`}
                            >
                              {c.crop_name} <span className="text-gray-400 text-xs">{c.variety ? `(${c.variety})` : ''}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No crops found.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative z-10">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sowing Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    max={todayStr}
                    value={formData.sowing_date}
                    onChange={(e) => setFormData({ ...formData, sowing_date: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 relative z-10">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm hover:bg-[#20401b] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('dashboard.addCrop')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
