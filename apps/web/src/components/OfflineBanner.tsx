'use client';

import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 px-4 py-3 text-center text-white">
      <p className="text-sm font-medium">No internet connection. Some features may not work.</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 rounded bg-white px-4 py-1 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
      >
        Retry
      </button>
    </div>
  );
}
