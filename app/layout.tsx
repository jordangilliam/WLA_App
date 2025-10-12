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
            id="main-nav"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '2rem 1.5rem',
              marginBottom: '1.5rem',
              minHeight: '200px',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              background: 'radial-gradient(ellipse at top left, #6B8E7F 0%, #8B7355 25%, #A0826D 50%, #D4A574 75%, #4A6F5C 100%)',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              border: 'none',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/images/menu/menu.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
              zIndex: 0,
              mixBlendMode: 'overlay'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem', padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🌲 WildPraxis</Link>
            <Link href="/learn" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>📚 Learn</Link>
            <Link href="/map" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🗺️ Map</Link>
            <Link href="/fishing" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🎣 Fishing</Link>
            <Link href="/gobblers" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🦃 Gobblers</Link>
            <Link href="/terrestrials" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🦌 Terrestrials</Link>
            <Link href="/keys/macro" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🔬 Macro</Link>
            <Link href="/keys/plants" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🌿 Plants</Link>
            <Link href="/keys/bugs" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🐛 Bugs</Link>
            <Link href="/birds" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🦜 Birds</Link>
            <Link href="/habitat" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🏕️ Habitat</Link>
            <Link href="/journal" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>📸 Journal</Link>
            <Link href="/outreach" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>📢 Outreach</Link>
            <Link href="/jobs" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>💼 Jobs</Link>
            <Link href="/media" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🎥 Media</Link>
            <Link href="/leaderboard" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🏆 Leaderboard</Link>
            <Link href="/exports" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>💾 Export</Link>
            <Link href="/wildpraxis-export" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>📊 WildPraxis Export</Link>
            <Link href="/auth" style={{ padding: '0.5rem 1rem', background: 'rgba(71, 85, 105, 0.75)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(4px)' }}>🔐 Sign In</Link>
            </div>
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
              <Link href="/wildpraxis-export" style={{ color: 'var(--text-muted)' }}>WildPraxis Export</Link>
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
