import { Sprout, CloudRainWind, Cpu } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function FeatureBanner() {
  const { t } = useLanguage();
  const features = [
    {
      icon: Sprout,
      title: t('features.cropsSupportedTitle'),
      description: t('features.cropsSupportedDesc'),
    },
    {
      icon: CloudRainWind,
      title: t('features.weatherSyncTitle'),
      description: t('features.weatherSyncDesc'),
    },
    {
      icon: Cpu,
      title: t('features.noHardwareTitle'),
      description: t('features.noHardwareDesc'),
    },
  ];

  return (
    <div className="w-full border-y border-slate-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={`flex items-center gap-4 ${index !== 0 ? 'md:pl-8 pt-6 md:pt-0' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-0.5">{feature.title}</h4>
                  <p className="text-xs text-slate-500">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
