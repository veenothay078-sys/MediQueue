import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, RefreshCw, Smartphone } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showUniversalModal, setShowUniversalModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [activeTab, setActiveTab] = useState('android');
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    // 1. Detect if running in standalone mode (already installed)
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(isRunningStandalone);

    // 2. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream;
    setIsIos(isIosDevice);
    if (isIosDevice) {
      setActiveTab('ios');
    }

    // 3. Android/Chrome BeforeInstallPrompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissedTime = localStorage.getItem('mediqueue_pwa_dismissed');
      const isRecentlyDismissed =
        dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 3 * 24 * 60 * 60 * 1000;
      if (!isRecentlyDismissed && !isRunningStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Listen for manual "Install App" trigger from Navbar or buttons
    const handleOpenInstallModal = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
      } else {
        setShowUniversalModal(true);
      }
    };
    window.addEventListener('mediqueue_open_install_modal', handleOpenInstallModal);

    // 5. Detect when successfully installed
    window.addEventListener('appinstalled', () => {
      console.log('[MediQueue PWA] App was successfully installed');
      setShowInstallBanner(false);
      setShowUniversalModal(false);
      setDeferredPrompt(null);
    });

    // 6. Listen for SW update message from window
    const handleSwUpdate = (e) => {
      if (e.detail && e.detail.waiting) {
        setWaitingWorker(e.detail.waiting);
        setUpdateAvailable(true);
      }
    };
    window.addEventListener('mediqueue_sw_update', handleSwUpdate);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('mediqueue_open_install_modal', handleOpenInstallModal);
      window.removeEventListener('mediqueue_sw_update', handleSwUpdate);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[MediQueue PWA] User install choice:', outcome);
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowUniversalModal(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    setShowUniversalModal(false);
    localStorage.setItem('mediqueue_pwa_dismissed', Date.now().toString());
  };

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  return (
    <>
      {/* ── UPDATE AVAILABLE BANNER ── */}
      {updateAvailable && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md p-3.5 bg-slate-900 text-white rounded-2xl shadow-elevated border border-teal-500/30 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />
            <span className="text-xs font-semibold text-slate-100">
              New version of MediQueue available.
            </span>
          </div>
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Update Now
          </button>
        </div>
      )}

      {/* ── STANDARD INSTALL BANNER (Android / Chrome / Desktop) ── */}
      {showInstallBanner && !isStandalone && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-elevated transition-all animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black flex-shrink-0 shadow-sm">
                <BrandLogo size="sm" showTagline={false} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Install MediQueue
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Get faster access to your appointments and queue.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Not now
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm shadow-teal-700/20 inline-flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Install App
            </button>
          </div>
        </div>
      )}

      {/* ── UNIVERSAL MULTI-PLATFORM INSTALL MODAL GUIDE ── */}
      {showUniversalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-elevated border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <BrandLogo size="sm" showTagline={false} />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-none">
                    Install MediQueue App
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Run full-screen as a mobile application
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowUniversalModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('android')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Android
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                iPhone / iPad
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'desktop'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                PC / Laptop
              </button>
            </div>

            {/* Android Instructions */}
            {activeTab === 'android' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    In <strong>Google Chrome</strong> or <strong>Samsung Internet</strong>, tap the <strong>3 dots (⋮)</strong> menu in the top right.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    Tap <strong>Install</strong>. MediQueue will appear on your phone home screen!
                  </span>
                </div>
              </div>
            )}

            {/* iOS Instructions */}
            {activeTab === 'ios' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    In <strong>Safari</strong>, tap the <Share className="w-3.5 h-3.5 text-teal-600 inline ml-0.5" /> <strong>Share</strong> button at the bottom toolbar.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-teal-600 inline ml-0.5" /> <strong>Add to Home Screen</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    Tap <strong>Add</strong> in the top-right corner.
                  </span>
                </div>
              </div>
            )}

            {/* Desktop Instructions */}
            {activeTab === 'desktop' && (
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    Look at the right side of the browser URL/address bar for the <strong>Install</strong> icon.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span className="text-slate-700 dark:text-slate-200">
                    Click <strong>Install MediQueue</strong> to run as a native desktop application.
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowUniversalModal(false)}
              className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-all shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
