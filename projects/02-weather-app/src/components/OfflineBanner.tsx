import { useState, useEffect } from 'react';

interface OfflineBannerProps {
  cachedAt?: number;
}

export function OfflineBanner({ cachedAt }: OfflineBannerProps) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline = () => { setIsOffline(false); };
    const onOffline = () => { setIsOffline(true); };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (!isOffline) return null;

  const ageText = cachedAt
    ? (() => {
        const minutes = Math.floor((Date.now() - cachedAt) / 60000);
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
      })()
    : null;

  return (
    <div
      role="alert"
      className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm"
    >
      <span aria-hidden="true">⚠️</span>
      <span>
        You are offline.
        {ageText ? ` Showing weather cached ${ageText}.` : ' No cached data available.'}
      </span>
    </div>
  );
}
