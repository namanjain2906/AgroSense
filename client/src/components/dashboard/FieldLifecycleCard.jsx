import React from 'react';
import { motion } from 'framer-motion';
import { ThermometerSun, Droplet, Ruler, AlertTriangle, Download, ChevronDown, CheckCircle2 } from 'lucide-react';

const calculateDays = (dateStr) => {
  const diffTime = Math.abs(new Date() - new Date(dateStr));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

export default function FieldLifecycleCard({ field }) {
  const { cropProfileId: crop, sowing_date, is_active, harvested_date } = field;
  const stages = crop?.lifecycle_stages || [];
  
  let currentDas = 0;
  if (is_active) {
    const diffTime = new Date() - new Date(sowing_date);
    currentDas = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  } else if (harvested_date) {
    const diffTime = new Date(harvested_date) - new Date(sowing_date);
    currentDas = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const finalStageDay = stages.length > 0 ? stages[stages.length - 1].day_end : 0;
  const totalLifecycleDays = finalStageDay || 120; // fallback
  const progressPercent = Math.min(100, Math.round((currentDas / totalLifecycleDays) * 100));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full mb-8 relative"
    >
      {/* Header */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-green-50/50 to-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1f2937] tracking-tight capitalize mb-1">
              {crop?.crop_name || 'Crop Name'}
            </h2>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Premium {crop?.variety || 'Variety'}</span>
            </div>
          </div>
          <div className="text-right text-xs font-medium text-gray-400">
            {is_active ? `Last synced: just now` : `Harvested on ${new Date(harvested_date).toLocaleDateString()}`}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6 relative z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-semibold text-gray-700">
            <span className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">📅</span>
            Total Lifecycle: {totalLifecycleDays} Days
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-semibold text-gray-700">
            <span className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">🌱</span>
            Ideal Soil: {crop?.soil_type?.[0] || 'Unknown'}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-semibold text-gray-700">
            <span className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">🌡️</span>
            Base Temp: {stages[0]?.ideal_conditions?.min_temp || 20}°C
          </div>
        </div>
        
        {/* Background Decorative Blob */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-100/50 rounded-full blur-3xl" />
      </div>

      <div className="px-6 md:px-8 py-8">
        <div className="relative border-l-2 border-green-100 pl-6 md:pl-8 space-y-8">
          {stages.map((stage, idx) => {
            const isPast = currentDas > stage.day_end;
            const isCurrent = currentDas >= stage.day_start && currentDas <= stage.day_end;
            const isUpcoming = currentDas < stage.day_start;

            const getStatusColor = () => {
              if (isPast) return "bg-green-800 border-green-800 text-white";
              if (isCurrent) return "bg-[var(--color-primary)] border-[var(--color-primary)] text-white";
              return "bg-gray-100 border-gray-200 text-gray-400";
            };

            const getBadgeColor = () => {
              if (isPast) return "bg-green-50 text-green-700";
              if (isCurrent) return "bg-green-100 text-green-800 font-bold";
              return "bg-gray-100 text-gray-500";
            };

            return (
              <div key={idx} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-[35px] md:-left-[43px] w-4 h-4 rounded-full border-2 ${getStatusColor()} ring-4 ring-white z-10 top-5`} />

                <div className={`border rounded-2xl p-4 md:p-6 transition-all ${isCurrent ? 'bg-white border-green-200 shadow-lg shadow-green-900/5' : 'bg-white border-gray-100 shadow-sm opacity-70'}`}>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black ${getStatusColor()}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 capitalize">{stage.stage_name}</h3>
                      <span className={`text-[10px] md:text-xs uppercase tracking-wider px-2 py-0.5 rounded-full ${getBadgeColor()}`}>
                        DAYS {stage.day_start} - {stage.day_end}
                      </span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {/* Temp Box */}
                    <div className="bg-[#FAF9F6] rounded-xl p-4 flex gap-4 items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <ThermometerSun className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Temp Range</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {stage.ideal_conditions.min_temp}°C - {stage.ideal_conditions.max_temp}°C
                        </p>
                      </div>
                    </div>

                    {/* Watering Box */}
                    <div className="bg-[#FAF9F6] rounded-xl p-4 flex gap-4 items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Droplet className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Watering</p>
                        <p className="text-sm font-semibold text-gray-800">
                          Max {stage.ideal_conditions.max_days_without_water} days dry
                        </p>
                      </div>
                    </div>

                    {/* Height Box */}
                    <div className="bg-[#FAF9F6] rounded-xl p-4 flex gap-4 items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Ruler className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Expected Height</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {stage.expected_growth.min_height_cm}cm - {stage.expected_growth.max_height_cm}cm
                        </p>
                      </div>
                    </div>

                    {/* Risk Box */}
                    <div className="bg-red-50/50 rounded-xl p-4 flex gap-4 items-center border border-red-100/50">
                      <div className="bg-white p-2 rounded-lg shadow-sm border border-red-100">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-red-400 mb-0.5">Risk Factors</p>
                        <p className="text-sm font-semibold text-red-700">
                          Heat Stress {'>'} {stage.ideal_conditions.max_temp}°C
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 md:p-8 bg-[#FAF9F6] border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${field._id}1`} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${field._id}2`} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-800">2 Experts</span> monitoring this profile
          </p>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="flex-1 md:w-48">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2">
              <span>Growth Progress</span>
              <span className="text-[var(--color-primary)]">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold text-sm rounded-xl hover:bg-[#20401b] transition-colors shrink-0 shadow-lg shadow-green-900/20">
            Download Full Report
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
