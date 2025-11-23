'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Simplified navigation - 3 core items (matching industry best practices from PBS Kids, NatGeo Kids)
// Secondary items (Achievements, Profile) moved to user menu/profile page
const NAV_ITEMS = [
  { href: '/explore', label: 'Explore', icon: '🗺️' },
  { href: '/learn', label: 'Learn', icon: '📘' },
  { href: '/journal-new', label: 'Journal', icon: '📝' },
] as const;

export default function PrimaryNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="primary-nav">
      <div className="primary-nav__scroll">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`primary-nav__item ${active ? 'active' : ''}`}
            >
              <span className="primary-nav__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="primary-nav__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

