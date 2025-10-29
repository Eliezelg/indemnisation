'use client';

import SkeletonCard from './SkeletonCard';

interface SkeletonGridProps {
  count?: number;
  variant?: 'stat' | 'card' | 'testimonial' | 'airline';
  columns?: 1 | 2 | 3 | 4 | 6;
  className?: string;
}

export default function SkeletonGrid({
  count = 3,
  variant = 'card',
  columns = 3,
  className = ''
}: SkeletonGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <SkeletonCard key={index} variant={variant} />
      ))}
    </div>
  );
}
