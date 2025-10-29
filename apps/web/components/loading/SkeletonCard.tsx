'use client';

interface SkeletonCardProps {
  variant?: 'stat' | 'card' | 'testimonial' | 'airline';
  className?: string;
}

export default function SkeletonCard({ variant = 'card', className = '' }: SkeletonCardProps) {
  if (variant === 'stat') {
    return (
      <div className={`rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 p-6 animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full" />
          <div className="w-8 h-8 bg-gray-300 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-300 rounded w-24" />
          <div className="h-4 bg-gray-300 rounded w-32" />
        </div>
      </div>
    );
  }

  if (variant === 'testimonial') {
    return (
      <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg animate-pulse ${className}`}>
        {/* Stars */}
        <div className="flex items-center mb-4 space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-5 h-5 bg-gray-200 rounded" />
          ))}
        </div>

        {/* Quote */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>

        {/* Author */}
        <div className="flex items-center space-x-4 mb-6 pt-4 border-t border-gray-100">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        </div>

        {/* Amount Badge */}
        <div className="h-8 bg-gray-200 rounded-full w-32" />
      </div>
    );
  }

  if (variant === 'airline') {
    return (
      <div className={`bg-white rounded-2xl p-6 shadow-lg animate-pulse ${className}`}>
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200" />
        <div className="h-4 bg-gray-200 rounded mx-auto w-24" />
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg animate-pulse ${className}`}>
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}
