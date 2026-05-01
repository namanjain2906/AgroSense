import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Leaf,
  Loader2,
  Ruler,
  Thermometer,
  Waves,
  X,
} from 'lucide-react';
import api from '../../services/api';

const statusStyles = {
  OPTIMAL: 'border-green-200 bg-green-50 text-green-700',
  WARNING: 'border-amber-200 bg-amber-50 text-amber-700',
  STRESS: 'border-red-200 bg-red-50 text-red-700',
  MISSING_DATA: 'border-stone-200 bg-stone-100 text-stone-700',
};

const metricIcons = {
  stage: Leaf,
  temperature: Thermometer,
  water: Waves,
  height: Ruler,
};

const formatValue = (value, unit = '') => {
  if (value === null || value === undefined) return 'Not reported';
  return `${value}${unit}`;
};

const formatIdeal = (metric) => {
  const min = metric.ideal_min;
  const max = metric.ideal_max;
  const unit = metric.ideal_unit || '';

  if (min !== null && min !== undefined && max !== null && max !== undefined) {
    return `${min}${unit} - ${max}${unit}`;
  }

  if (max !== null && max !== undefined) return `Up to ${max}${unit}`;
  if (min !== null && min !== undefined) return `At least ${min}${unit}`;
  return metric.ideal || 'Not configured';
};

const getMetricSentence = (metric) => {
  const current = formatValue(metric.actual_value, metric.actual_unit);
  const ideal = formatIdeal(metric);
  const reason = metric.status === 'OPTIMAL' ? 'Favorable' : metric.message;

  return `${metric.label || metric.metric}: Current ${current} | Ideal Range: ${ideal} (${reason})`;
};

export default function DiagnosticsModal({ field, isOpen, onClose, onRefetch }) {
  const fieldId = field?._id;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [heightValue, setHeightValue] = useState('');
  const [heightSaving, setHeightSaving] = useState(false);
  const [heightError, setHeightError] = useState('');

  const missingHeight = useMemo(
    () => report?.metric_comparisons?.find((metric) => metric.key === 'height' && metric.status === 'MISSING_DATA'),
    [report],
  );

  const fetchReport = useCallback(async () => {
    if (!fieldId) return;

    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/api/fields/${fieldId}/report`);
      setReport(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load diagnostics.');
    } finally {
      setLoading(false);
    }
  }, [fieldId]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const timeoutId = window.setTimeout(() => {
      fetchReport();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchReport, isOpen]);

  const submitHeight = async (event) => {
    event.preventDefault();
    const height = Number(heightValue);

    if (!Number.isFinite(height) || height < 0) {
      setHeightError('Enter a valid non-negative height.');
      return;
    }

    setHeightSaving(true);
    setHeightError('');
    try {
      await api.put(`/api/fields/${fieldId}/log-action`, {
        actionType: 'HEIGHT_CHECK',
        value: height,
      });
      setHeightValue('');
      await Promise.all([fetchReport(), onRefetch?.()]);
    } catch (err) {
      setHeightError(err.response?.data?.message || 'Failed to update height.');
    } finally {
      setHeightSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#FFFDF6] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-emerald-900/10 bg-[#F7F1DF] px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
                  Deep Crop Diagnostics
                </p>
                <h3 className="mt-1 text-xl font-extrabold capitalize tracking-tight text-stone-900">
                  {field?.cropProfileId?.crop_name || report?.crop_name || 'Crop'} report
                </h3>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-white/70 hover:text-stone-900"
                aria-label="Close diagnostics"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(88vh-76px)] overflow-y-auto p-5">
              {loading ? (
                <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-900/10 bg-white/60 text-stone-500">
                  <Loader2 className="h-7 w-7 animate-spin text-[var(--color-primary)]" />
                  <p className="text-sm font-semibold">Crunching crop profile, weather, water, and growth data...</p>
                </div>
              ) : error ? (
                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              ) : report ? (
                <>
                  <div className="mb-5 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
                        Overall Health
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold ${
                            statusStyles[report.overall_status_code] || statusStyles.WARNING
                          }`}
                        >
                          {report.overall_status_code === 'OPTIMAL' ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          )}
                          {report.overall_status}
                        </span>
                        <span className="text-sm font-semibold text-stone-700">
                          {report.health_summary}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-900/10 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
                        Lifecycle Stage
                      </p>
                      <p className="mt-2 text-sm font-bold text-stone-900">
                        {report.current_stage_name}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-stone-500">
                        Day {report.das} after sowing
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white">
                    <div className="grid grid-cols-12 border-b border-emerald-900/10 bg-[#FBF8EF] px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-stone-500">
                      <span className="col-span-4">Metric</span>
                      <span className="col-span-3">Current</span>
                      <span className="col-span-3">Ideal Range</span>
                      <span className="col-span-2 text-right">Status</span>
                    </div>

                    <div className="divide-y divide-emerald-900/10">
                      {(report.metric_comparisons || report.report_metrics || []).map((metric) => {
                        const Icon = metricIcons[metric.key] || Leaf;

                        return (
                          <div key={metric.key || metric.metric} className="px-4 py-4">
                            <div className="grid grid-cols-12 items-start gap-3">
                              <div className="col-span-12 flex items-center gap-2 md:col-span-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ECF5E8] text-[var(--color-primary)]">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-bold text-stone-900">{metric.label || metric.metric}</p>
                                  <p className="mt-0.5 text-xs font-medium text-stone-500">{metric.reason}</p>
                                </div>
                              </div>
                              <div className="col-span-4 text-sm font-semibold text-stone-800 md:col-span-3">
                                {formatValue(metric.actual_value, metric.actual_unit)}
                              </div>
                              <div className="col-span-5 text-sm font-semibold text-stone-800 md:col-span-3">
                                {formatIdeal(metric)}
                              </div>
                              <div className="col-span-3 text-right md:col-span-2">
                                <span
                                  className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                                    statusStyles[metric.status] || statusStyles.WARNING
                                  }`}
                                >
                                  {metric.status_label || metric.status}
                                </span>
                              </div>
                            </div>
                            <p className="mt-3 rounded-xl bg-[#FBF8EF] px-3 py-2 text-sm font-medium leading-relaxed text-stone-700">
                              {getMetricSentence(metric)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {missingHeight && (
                    <form
                      onSubmit={submitHeight}
                      className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4"
                    >
                      <div className="mb-3 flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        <div>
                          <p className="font-bold text-amber-900">Height data is missing</p>
                          <p className="mt-1 text-sm font-medium text-amber-800">
                            Add the latest crop height now to complete the growth analysis.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={heightValue}
                          onChange={(event) => setHeightValue(event.target.value)}
                          className="min-w-0 flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          placeholder="Current height in cm"
                        />
                        <button
                          type="submit"
                          disabled={heightSaving}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-800 disabled:opacity-60"
                        >
                          {heightSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                          Update Height
                        </button>
                      </div>
                      {heightError && <p className="mt-2 text-xs font-bold text-red-600">{heightError}</p>}
                    </form>
                  )}
                </>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
