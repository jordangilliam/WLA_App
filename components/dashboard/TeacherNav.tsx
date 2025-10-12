'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navItems = [
  { href: '/dashboard/teacher', label: '📊 Dashboard', icon: '📊' },
  { href: '/dashboard/teacher/classes', label: '📚 My Classes', icon: '📚' },
  { href: '/dashboard/teacher/groups', label: '👥 Groups', icon: '👥' },
  { href: '/dashboard/teacher/reports', label: '📈 Reports', icon: '📈' },
  { href: '/dashboard/teacher/settings', label: '⚙️ Settings', icon: '⚙️' },
];

export default function TeacherNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
      padding: '1rem 0',
      marginBottom: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 1rem',
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '0.75rem 1.5rem',
                background: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                color: isActive ? '#1E40AF' : 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                border: isActive ? '2px solid white' : '2px solid transparent',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

