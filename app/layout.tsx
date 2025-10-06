import '../styles/globals.css';
import Link from 'next/link';
import { PointsProvider } from '@/ui/points/PointsProvider';

export const metadata = {
  title: 'WLA Conservation Ambassadors - Youth Conservation Leadership',
  description: 'Wildlife Leadership Academy app for PA youth to learn, explore, and become conservation leaders'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PointsProvider>
          <nav className="container">
            <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem' }}>🌲 WLA</Link>
            <Link href="/learn">📚 Learn</Link>
            <Link href="/map">🗺️ Map</Link>
            <Link href="/keys/macro">🔬 Macro</Link>
            <Link href="/keys/plants">🌿 Plants</Link>
            <Link href="/keys/bugs">🐛 Bugs</Link>
            <Link href="/birds">🦜 Birds</Link>
            <Link href="/habitat">🏕️ Habitat</Link>
            <Link href="/journal">📸 Journal</Link>
            <Link href="/outreach">📢 Outreach</Link>
            <Link href="/jobs">💼 Jobs</Link>
            <Link href="/media">🎥 Media</Link>
            <Link href="/leaderboard">🏆 Leaderboard</Link>
            <Link href="/exports">💾 Export</Link>
            <Link href="/auth">🔐 Sign In</Link>
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
