'use client';

import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  illustration?: React.ReactNode;
}

export default function EmptyState({
  icon = '🔍',
  title,
  description,
  action,
  illustration,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        minHeight: '400px',
      }}
    >
      {illustration ? (
        <div style={{ marginBottom: '1.5rem', fontSize: '4rem' }}>{illustration}</div>
      ) : (
        <div style={{ marginBottom: '1.5rem', fontSize: '4rem' }}>{icon}</div>
      )}
      
      <h3
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#0F172A',
          marginBottom: '0.75rem',
        }}
      >
        {title}
      </h3>
      
      <p
        style={{
          fontSize: '1rem',
          color: '#64748B',
          maxWidth: '500px',
          marginBottom: action ? '2rem' : '0',
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
      
      {action && (
        <Link
          href={action.href}
          style={{
            padding: '0.875rem 1.75rem',
            background: '#0EA5E9',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'all 0.2s',
            display: 'inline-block',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#0284C7';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#0EA5E9';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

