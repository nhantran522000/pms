'use client';

import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check initial online status
    setIsOffline(!navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render during SSR
  if (!isClient || !isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 text-center py-2 text-sm font-medium z-50">
      No internet connection. Some features may be unavailable.
    </div>
  );
}
