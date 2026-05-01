import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';

export default function EnvironmentalSnapshot() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 md:hidden">
      <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50">
        <Thermometer className="w-5 h-5 text-[var(--color-primary)] mb-2" />
        <p className="text-xs font-medium text-gray-500 mb-0.5">Avg. Soil Temp</p>
        <p className="text-2xl font-bold text-gray-800">24.2°C</p>
      </div>
      
      <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50">
        <Droplets className="w-5 h-5 text-[var(--color-primary)] mb-2" />
        <p className="text-xs font-medium text-gray-500 mb-0.5">Humidity</p>
        <p className="text-2xl font-bold text-gray-800">62%</p>
      </div>
    </div>
  );
}
