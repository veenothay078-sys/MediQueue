/**
 * Service Worker Registration and Update Manager for MediQueue PWA
 */

export function registerServiceWorker(callbacks = {}) {
  const { onUpdate, onSuccess } = callbacks;

  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[MediQueue PWA] Service Worker registered with scope:', registration.scope);

        if (onSuccess) onSuccess(registration);

        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                console.log('[MediQueue PWA] New update available');
                if (onUpdate) onUpdate(registration);
              } else {
                // Content cached for offline use
                console.log('[MediQueue PWA] Content is cached for offline use.');
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('[MediQueue PWA] Service Worker registration failed:', error);
      });
  });
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
