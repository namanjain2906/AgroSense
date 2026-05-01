import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import FieldLifecycleCard from '../components/dashboard/FieldLifecycleCard';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function Fields() {
  const { t } = useLanguage();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        // Do not pass active=true so we get all fields (active and harvested)
        const res = await api.get('/api/fields');
        setFields(res.data?.fields || res.data || []);
      } catch (err) {
        console.error('Failed to fetch fields', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">{t('dashboard.myFieldsAndCrops')}</h1>
        <p className="text-stone-500 mt-2">{t('dashboard.fieldsSubtitle')}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        </div>
      ) : fields.length > 0 ? (
        <div className="space-y-8">
          {fields.map(field => (
            <FieldLifecycleCard key={field._id} field={field} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">{t('dashboard.noFields')}</p>
        </div>
      )}
    </motion.div>
  );
}
