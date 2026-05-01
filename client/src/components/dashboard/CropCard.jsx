import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Droplet,
  FileText,
  Loader2,
  Ruler,
  Sprout,
} from 'lucide-react';
import api from '../../services/api';
import DiagnosticsModal from './DiagnosticsModal';

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getLocationLabel = (location) => {
  if (!location) return 'Main Field';
  if (location.name) return location.name;
  return [location.city, location.state].filter(Boolean).join(', ') || 'Main Field';
};



export default function CropCard({ field, weather, onRefetch }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [heightEditOpen, setHeightEditOpen] = useState(false);
  const [heightValue, setHeightValue] = useState('');
  const [heightError, setHeightError] = useState('');
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);

  const isOptimal = (field.status || 'Optimal') === 'Optimal';
  const statusText = field.status || 'Optimal';

  const logAction = async (actionType, value = null) => {
    setLoadingAction(actionType);
    setHeightError('');

    try {
      await api.put(`/api/fields/${field._id}/log-action`, { actionType, value });
      await onRefetch?.();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update crop.';
      setHeightError(message);
    } finally {
      setLoadingAction(null);
    }
  };

  const submitHeight = async (event) => {
    event.preventDefault();
    const height = Number(heightValue);

    if (!Number.isFinite(height) || height < 0) {
      setHeightError('Enter a valid non-negative height.');
      return;
    }

    await logAction('HEIGHT_CHECK', height);
    setHeightEditOpen(false);
    setHeightValue('');
  };

  return (
    <>
      <motion.article
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
        }}
        className="group rounded-2xl border border-emerald-900/10 bg-[var(--color-surface)] p-5 shadow-[0_12px_32px_-26px_rgba(47,93,49,0.45)] transition-all hover:-translate-y-0.5 hover:border-emerald-900/20 hover:shadow-[0_18px_42px_-28px_rgba(47,93,49,0.55)]"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECF5E8] text-[var(--color-primary)]">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
                {field.cropProfileId?.variety || 'Tracked crop'}
              </p>
              <h3 className="text-2xl font-extrabold capitalize tracking-tight text-stone-900">
                {field.cropProfileId?.crop_name || 'Unknown Crop'}
              </h3>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${
              isOptimal
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-600'
            }`}
          >
            {isOptimal ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
            {statusText}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3">
            <p className="font-bold uppercase tracking-wide text-stone-400">Field</p>
            <p className="mt-1 truncate font-semibold text-stone-800">{getLocationLabel(field.location)}</p>
          </div>
          <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3">
            <p className="font-bold uppercase tracking-wide text-stone-400">Height</p>
            <p className="mt-1 font-semibold text-stone-800">
              {field.latest_reported_height_cm === null || field.latest_reported_height_cm === undefined
                ? 'Not logged'
                : `${field.latest_reported_height_cm} cm`}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3">
            <p className="font-bold uppercase tracking-wide text-stone-400">Sown</p>
            <p className="mt-1 font-semibold text-stone-800">{formatDate(field.sowing_date)}</p>
          </div>
          <div className="rounded-xl border border-stone-200/70 bg-white/70 p-3">
            <p className="font-bold uppercase tracking-wide text-stone-400">Temperature</p>
            <p className="mt-1 font-semibold text-stone-800">
              {!weather || weather.current_temp === undefined || weather.current_temp === null
                ? 'Checking...'
                : `${Math.round(weather.current_temp)}°C`}
            </p>
          </div>
        </div>


        <div className="mt-4 flex gap-2 border-t border-emerald-900/10 pt-4">
          <button
            onClick={() => logAction('WATER')}
            disabled={loadingAction !== null}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
          >
            {loadingAction === 'WATER' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Droplet className="h-3.5 w-3.5" />}
            Log Water
          </button>

          {heightEditOpen ? (
            <form onSubmit={submitHeight} className="flex flex-1 items-center gap-1.5">
              <input
                type="number"
                min="0"
                step="0.1"
                autoFocus
                value={heightValue}
                onChange={(event) => setHeightValue(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs font-semibold text-stone-800 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-green-800/10"
                placeholder="cm"
              />
              <button
                type="submit"
                disabled={loadingAction !== null}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-700 text-sm font-black text-white transition-colors hover:bg-green-800 disabled:opacity-50"
                aria-label="Submit height"
              >
                {loadingAction === 'HEIGHT_CHECK' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '✓'}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setHeightEditOpen(true)}
              disabled={loadingAction !== null}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-50"
            >
              <Ruler className="h-3.5 w-3.5" />
              Update Height
            </button>
          )}
        </div>

        {heightError && (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
            {heightError}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-emerald-900/10 pt-3">
          <button
            onClick={() => setDiagnosticsOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-stone-500 transition-colors hover:bg-[#FBF8EF] hover:text-[var(--color-primary)]"
          >
            <FileText className="h-3.5 w-3.5" />
            View Diagnostics
          </button>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to log this crop as harvested? It will be removed from your active crops.')) {
                setLoadingAction('HARVEST');
                try {
                  await api.patch(`/api/fields/${field._id}/deactivate`);
                  if (onRefetch) onRefetch();
                } catch (err) {
                  setHeightError(err.response?.data?.message || 'Failed to mark as harvested.');
                } finally {
                  setLoadingAction(null);
                }
              }
            }}
            disabled={loadingAction !== null}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-50 disabled:opacity-50"
          >
            {loadingAction === 'HARVEST' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            Mark Harvested
          </button>
        </div>
      </motion.article>

      <DiagnosticsModal
        field={field}
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
        onRefetch={onRefetch}
      />
    </>
  );
}
