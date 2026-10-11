import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export const OfflineBanner = () => {
  const { isOnline, pendingSyncCount, syncPendingData } = useAuth();
  const { t } = useLanguage();

  if (isOnline && pendingSyncCount === 0) return null;

  return (
    <div className={`w-full px-4 py-2 text-sm font-medium transition-colors ${
      !isOnline
        ? 'bg-amber-500 text-amber-950 dark:bg-amber-600 dark:text-amber-50'
        : 'bg-emerald-600 text-white'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
              <span>{t('offlineBanner')}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Connected online! {pendingSyncCount} offline attempts ready to sync.</span>
            </>
          )}
        </div>

        {isOnline && pendingSyncCount > 0 && (
          <button
            onClick={syncPendingData}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white text-emerald-800 rounded-md shadow hover:bg-slate-100 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
};
