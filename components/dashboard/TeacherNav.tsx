'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard/teacher', label: 'Overview', icon: '📊' },
  { href: '/dashboard/teacher/classes', label: 'Classes', icon: '👥' },
  { href: '/dashboard/teacher/students', label: 'Students', icon: '🎓' },
  { href: '/dashboard/teacher/assignments', label: 'Assignments', icon: '📝' },
  { href: '/dashboard/teacher/reports', label: 'Reports', icon: '📈' },
];

export default function TeacherNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      style={{
        background: 'white',
        borderRadius: '24px',
        padding: '1rem 1.25rem',
        boxShadow: '0 15px 45px rgba(15,23,42,0.08)',
        border: '1px solid rgba(148,163,184,0.2)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: '0 1 auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '999px',
                fontWeight: 600,
                textDecoration: 'none',
                color: active ? 'white' : '#0F172A',
                background: active ? 'linear-gradient(135deg, #0F766E, #0EA5E9)' : 'rgba(241,245,249,0.9)',
                boxShadow: active ? '0 10px 25px rgba(15,23,42,0.25)' : 'none',
                border: active ? 'none' : '1px solid rgba(148,163,184,0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
