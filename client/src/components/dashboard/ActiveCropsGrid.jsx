import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import CropCard from './CropCard';
import { useLanguage } from '../../context/useLanguage';

export default function ActiveCropsGrid({ crops, weather, onAddCrop, onRefetch }) {
  const { t } = useLanguage();
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 md:text-2xl">
          {t('dashboard.activeCrops')}
        </h2>
        <button
          onClick={onAddCrop}
          className="hidden items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-800 md:flex"
        >
          <Plus className="h-4 w-4" />
          {t('dashboard.addCrop')}
        </button>
        <button className="text-sm font-bold text-[var(--color-secondary)] md:hidden">
          {t('dashboard.viewMap')}
        </button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {crops.map((field) => (
          <CropCard key={field._id} field={field} weather={weather} onRefetch={onRefetch} />
        ))}
      </motion.div>
    </div>
  );
}
