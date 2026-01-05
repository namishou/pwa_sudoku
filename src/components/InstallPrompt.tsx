import { Download, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { vibrateLight } from '../utils/vibration';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    vibrateLight();
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    vibrateLight();
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slideUp">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 flex items-center gap-4 max-w-md mx-auto border-2 border-indigo-500">
        <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          <Download size={24} className="text-indigo-600 dark:text-indigo-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
            ホーム画面に追加
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            アプリとして使えます
          </p>
        </div>

        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors active:scale-95"
        >
          追加
        </button>

        <button
          onClick={handleDismiss}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="閉じる"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
}
