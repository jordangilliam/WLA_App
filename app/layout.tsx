import '../styles/globals.css';
import Link from 'next/link';
import { PointsProvider } from '@/ui/points/PointsProvider';
import PWAInstall from '@/components/PWAInstall';

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
      </head>
      <body>
        <PointsProvider>
          <PWAInstall />
          <nav 
            className="container" 
            style={{
              backgroundImage: 'url(/images/menu/menu.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem', textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🌲 WLA</Link>
            <Link href="/learn" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>📚 Learn</Link>
            <Link href="/map" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🗺️ Map</Link>
            <Link href="/fishing" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🎣 Fishing</Link>
            <Link href="/gobblers" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🦃 Gobblers</Link>
            <Link href="/terrestrials" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🦌 Terrestrials</Link>
            <Link href="/keys/macro" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🔬 Macro</Link>
            <Link href="/keys/plants" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🌿 Plants</Link>
            <Link href="/keys/bugs" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🐛 Bugs</Link>
            <Link href="/birds" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🦜 Birds</Link>
            <Link href="/habitat" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🏕️ Habitat</Link>
            <Link href="/journal" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>📸 Journal</Link>
            <Link href="/outreach" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>📢 Outreach</Link>
            <Link href="/jobs" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>💼 Jobs</Link>
            <Link href="/media" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🎥 Media</Link>
            <Link href="/leaderboard" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🏆 Leaderboard</Link>
            <Link href="/exports" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>💾 Export</Link>
            <Link href="/auth" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)', color: 'white' }}>🔐 Sign In</Link>
          </nav>
          <main className="container">{children}</main>
          <footer>
            <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>🌲🦌🐟🦃🐻</div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Wildlife Leadership Academy</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Empowering PA youth to become conservation leaders
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.9rem' }}>
              <Link href="/admin/automations" style={{ color: 'var(--text-muted)' }}>Admin</Link>
              <Link href="/katie-export" style={{ color: 'var(--text-muted)' }}>Katie Export</Link>
              <a href="https://wildlifeleadershipacademy.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>WLA Website</a>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Wildlife Leadership Academy
            </div>
          </footer>
        </PointsProvider>
      </body>
    </html>
  );
}
