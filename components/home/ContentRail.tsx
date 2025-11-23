'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface ContentRailProps {
  title: string;
  subtitle?: string;
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
  emptyMessage?: string;
  emptyIcon?: string;
  className?: string;
}

export default function ContentRail({
  title,
  subtitle,
  items,
  renderItem,
  viewAllHref,
  viewAllLabel = 'View All',
  emptyMessage = 'No content available',
  emptyIcon = '📭',
  className = '',
}: ContentRailProps) {
  if (items.length === 0) {
    return (
      <section className={`mb-8 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <div className="text-5xl mb-4">{emptyIcon}</div>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            {viewAllLabel} →
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item, index) => (
          <div key={item.id || index} className="flex-shrink-0">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </section>
  );
}

