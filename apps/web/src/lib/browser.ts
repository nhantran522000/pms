export const isBrowser = typeof window !== 'undefined';

export const isServiceWorkerSupported = isBrowser && 'serviceWorker' in navigator;
