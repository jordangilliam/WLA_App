'use client';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export default function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = '8px',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s ease-in-out infinite',
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        padding: '1.5rem',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Skeleton width="60%" height="1.5rem" borderRadius="8px" />
      <div style={{ marginTop: '0.75rem' }}>
        <Skeleton width="100%" height="1rem" borderRadius="8px" />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <Skeleton width="80%" height="1rem" borderRadius="8px" />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Skeleton width="40%" height="2rem" borderRadius="8px" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

