'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TeacherNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard/teacher', label: 'Overview', icon: '📊' },
    { href: '/dashboard/teacher/classes', label: 'Classes', icon: '👥' },
    { href: '/dashboard/teacher/students', label: 'Students', icon: '🎓' },
    { href: '/dashboard/teacher/assignments', label: 'Assignments', icon: '📝' },
    { href: '/dashboard/teacher/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <nav className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${isActive 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
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
