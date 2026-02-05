import { useState, useEffect } from 'react';
import './InstallPrompt.css';

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Show prompt after a short delay for better UX
      setTimeout(() => setIsVisible(true), 2000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsVisible(false);
    }

    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  if (isInstalled || !isVisible) return null;

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-icon">
          <svg viewBox="0 0 192 192" width="40" height="40">
            <rect width="192" height="192" rx="24" fill="#2e7d32"/>
            <polygon points="96,24 48,100 72,100 40,152 96,100 152,152 120,100 144,100" fill="#fff"/>
            <rect x="84" y="140" width="24" height="32" fill="#8B4513"/>
          </svg>
        </div>
        <div className="install-prompt-text">
          <strong>Install Timberworks</strong>
          <span>Add to home screen for quick access</span>
        </div>
      </div>
      <div className="install-prompt-actions">
        <button className="btn-dismiss" onClick={handleDismiss}>
          Not Now
        </button>
        <button className="btn-install" onClick={handleInstall}>
          Install
        </button>
      </div>
    </div>
  );
}
