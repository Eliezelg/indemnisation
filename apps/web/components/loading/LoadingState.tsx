'use client';

import Spinner from './Spinner';

interface LoadingStateProps {
  variant?: 'fullscreen' | 'section' | 'inline';
  message?: string;
  color?: 'blue' | 'white' | 'purple' | 'green';
  className?: string;
}

export default function LoadingState({
  variant = 'section',
  message = 'Chargement en cours...',
  color = 'blue',
  className = ''
}: LoadingStateProps) {

  if (variant === 'fullscreen') {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm ${className}`}>
        <div className="text-center">
          <Spinner size="xl" color={color} className="mx-auto mb-4" />
          <p className="text-gray-700 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Spinner size="sm" color={color} />
        <span className="text-sm text-gray-600">{message}</span>
      </div>
    );
  }

  // Section variant (default)
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <Spinner size="lg" color={color} className="mb-4" />
      <p className="text-gray-700 font-medium">{message}</p>
    </div>
  );
}
