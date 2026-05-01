import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function CropReportCard({ fieldId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/fields/${fieldId}/report`);
        setReport(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    if (fieldId) {
      fetchReport();
    }
  }, [fieldId]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="flex items-center justify-center p-6 bg-gray-50 rounded-xl mt-4 border border-gray-100"
      >
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="p-4 bg-red-50 text-red-600 rounded-xl mt-4 text-sm font-medium border border-red-100"
      >
        {error}
      </motion.div>
    );
  }

  if (!report) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 bg-[#F9FAFB] rounded-xl border border-gray-100 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 bg-white">
        <h4 className="font-bold text-gray-800 text-sm">Diagnostic Report</h4>
        <span className="text-xs font-bold text-[var(--color-primary)] bg-green-50 px-2.5 py-1.5 rounded-md border border-green-100 inline-block">
          Stage: {report.current_stage_name} (Day {report.das})
        </span>
      </div>
      
      <div className="p-4 space-y-3">
        {report.report_metrics.map((metric, idx) => {
          const isWarning = metric.status === 'Warning' || metric.status === 'Stress';
          
          return (
            <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="mt-0.5 shrink-0">
                {isWarning ? (
                  <AlertTriangle className={`w-5 h-5 ${metric.status === 'Stress' ? 'text-red-500' : 'text-amber-500'}`} />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-bold text-gray-800 truncate pr-2">{metric.metric}</span>
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    isWarning 
                      ? (metric.status === 'Stress' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100')
                      : 'bg-green-50 text-green-700 border border-green-100'
                  }`}>
                    {metric.status}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2 text-xs">
                  <div className="text-gray-700 flex items-center gap-1">
                    <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Actual:</span> 
                    <span className="font-medium bg-gray-50 px-1.5 py-0.5 rounded text-gray-700 border border-gray-100">{metric.actual}</span>
                  </div>
                  <div className="text-gray-700 flex items-center gap-1">
                    <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Ideal:</span> 
                    <span className="font-medium bg-gray-50 px-1.5 py-0.5 rounded text-gray-700 border border-gray-100">{metric.ideal}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{metric.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
