'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted (client-side only)
    setIsMounted(true);
    
    // Check if dismissed this session
    if (sessionStorage.getItem('wla-install-dismissed')) {
      setIsDismissed(true);
    }
    
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope);
            
            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute
          })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error);
          });
      });
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show install banner after 10 seconds
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallBanner(true);
        }
      }, 10000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      setIsInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    setIsDismissed(true);
    // Don't show again for this session
    sessionStorage.setItem('wla-install-dismissed', 'true');
  };

  // Don't render until mounted (client-side only)
  if (!isMounted || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Offline Indicator */}
      {!isOnline && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, #FFB703, #FB8500)',
            color: 'white',
            padding: '0.75rem',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '0.9rem',
            zIndex: 10000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          📡 You&apos;re offline - Some features may be limited
        </div>
      )}

      {/* Install Banner */}
      {showInstallBanner && !isInstalled && deferredPrompt && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '500px',
            width: 'calc(100% - 40px)',
            background: 'linear-gradient(135deg, #0077B6, #023047)',
            color: 'white',
            padding: '1.25rem',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 9999,
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>📱</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Install WLA App
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.95, marginBottom: '1rem', lineHeight: 1.4 }}>
                Get quick access to field tools, work offline, and receive notifications about new content!
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleInstallClick}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    background: '#FFD60A',
                    color: '#023047',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  Install Now
                </button>
                <button
                  onClick={handleDismiss}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  Later
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes slideUp {
              from {
                transform: translateX(-50%) translateY(100px);
                opacity: 0;
              }
              to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}

      {/* Installed Success Message (temporary) */}
      {isInstalled && (
        <div
          style={{
            position: 'fixed',
            top: !isOnline ? '60px' : '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #06D6A0, #059669)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>✅</span>
          <span>App installed! You can now use WLA offline</span>
        </div>
      )}
    </>
  );
}

