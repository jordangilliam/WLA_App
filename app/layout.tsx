import '../styles/globals.css';
import Link from 'next/link';
import { PointsProvider } from '@/ui/points/PointsProvider';
import { NavigationProvider } from '@/lib/contexts/NavigationContext';
import PWAInstall from '@/components/PWAInstall';
import GamificationBar from '@/components/layout/GamificationBar';
import BottomNav from '@/components/layout/BottomNav';

export const metadata = {
  title: 'WLA Conservation Ambassadors - Youth Conservation Leadership',
  description: 'Wildlife Leadership Academy app for PA youth to learn, explore, and become conservation leaders',
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#0077B6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WLA',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#0077B6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WLA" />
        
        {/* Brook AI Assistant Integration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.chatConfig = {  
                chatId: "FX9IIOtCFx",
                env: "skl"
              };
            `,
          }}
        />
        <script src="https://d36ewmyb2wrx29.cloudfront.net/index.js" async />
        
        {/* Mobile fixes for Brook chat widget */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Ensure Brook chat widget is visible and functional on mobile */
            @media (max-width: 768px) {
              /* Fix chat button visibility */
              [data-chat-id] {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                z-index: 9999 !important;
                display: block !important;
                visibility: visible !important;
              }
              
              /* Fix chat window on mobile - prevent keyboard overlap */
              .skl-chat-container,
              .skl-chat-widget,
              [class*="chat-container"],
              [class*="chat-widget"] {
                position: fixed !important;
                bottom: 0 !important;
                right: 0 !important;
                left: 0 !important;
                top: 10vh !important;
                max-width: 100vw !important;
                height: 90vh !important;
                max-height: 90vh !important;
                width: 100% !important;
                z-index: 9999 !important;
                border-radius: 12px 12px 0 0 !important;
                display: flex !important;
                flex-direction: column !important;
                overflow: hidden !important;
              }
              
              /* Chat messages area should scroll */
              .skl-chat-messages,
              [class*="chat-messages"],
              [class*="messages-container"] {
                flex: 1 !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                -webkit-overflow-scrolling: touch !important;
                padding-bottom: 20px !important;
              }
              
              /* Input container at bottom with padding */
              .skl-chat-input-container,
              .skl-chat-footer,
              [class*="chat-input-container"],
              [class*="chat-footer"],
              [class*="input-container"] {
                position: sticky !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                padding: 16px !important;
                padding-bottom: max(16px, env(safe-area-inset-bottom)) !important;
                background: white !important;
                border-top: 1px solid #e5e7eb !important;
                z-index: 10 !important;
                flex-shrink: 0 !important;
              }
              
              /* Ensure input is visible above keyboard */
              .skl-chat-input,
              [class*="chat-input"],
              textarea[placeholder*="message"],
              input[type="text"] {
                min-height: 44px !important;
                max-height: 120px !important;
                font-size: 16px !important;
                -webkit-appearance: none !important;
                padding: 12px !important;
                display: block !important;
                visibility: visible !important;
                width: 100% !important;
                box-sizing: border-box !important;
                border: 1px solid #d1d5db !important;
                border-radius: 8px !important;
                resize: none !important;
              }
              
              /* Ensure buttons in input area are visible */
              .skl-chat-input-container button,
              [class*="chat-input-container"] button,
              [class*="input-container"] button {
                min-height: 44px !important;
                min-width: 44px !important;
              }
              
              /* Fix for iOS viewport when keyboard appears */
              @supports (-webkit-touch-callout: none) {
                .skl-chat-container,
                .skl-chat-widget,
                [class*="chat-container"],
                [class*="chat-widget"] {
                  height: -webkit-fill-available !important;
                }
              }
            }
            
            /* Ensure chat widget doesn't conflict with our search */
            [data-chat-id],
            .skl-chat-button {
              z-index: 9998 !important;
            }
          `
        }} />
      </head>
      <body>
        <PointsProvider>
          <NavigationProvider>
            <PWAInstall />
            <GamificationBar />
            <main className="min-h-screen">{children}</main>
            <BottomNav />
          </NavigationProvider>
            <footer className="hidden md:block bg-gray-50 border-t border-gray-200 py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="text-4xl mb-4">🌲🦌🐟🦃🐻</div>
                <div className="font-semibold text-gray-900 mb-2">Wildlife Leadership Academy</div>
                <div className="text-sm text-gray-600 mb-6">
                  Empowering PA youth to become conservation leaders
                </div>
                <div className="flex gap-6 justify-center text-sm">
                  <Link href="/admin/automations" className="text-gray-600 hover:text-green-600">Admin</Link>
                  <a href="https://wildlifeleadershipacademy.org" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600">WLA Website</a>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  © {new Date().getFullYear()} Wildlife Leadership Academy
                </div>
              </div>
            </footer>
          </NavigationProvider>
        </PointsProvider>
      </body>
    </html>
  );
}
