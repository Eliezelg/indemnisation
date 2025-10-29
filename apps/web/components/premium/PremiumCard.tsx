'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PremiumCardProps {
  children: ReactNode;
  hover?: boolean;
  gradient?: boolean;
  glassmorphism?: boolean;
  className?: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
}

export default function PremiumCard({
  children,
  hover = true,
  gradient = false,
  glassmorphism = false,
  className = '',
  icon,
  title,
  description,
}: PremiumCardProps) {
  const baseClasses = 'relative overflow-hidden rounded-2xl';

  const backgroundClasses = glassmorphism
    ? 'bg-gradient-glass backdrop-blur-md border border-white/20'
    : gradient
    ? 'bg-gradient-card border border-gray-200'
    : 'bg-white border border-gray-200';

  const hoverClasses = hover
    ? 'hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`group ${baseClasses} ${backgroundClasses} ${hoverClasses} ${className}`}
    >
      {/* Gradient overlay on hover */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
      )}

      {/* Content */}
      <div className="relative p-6 md:p-8">
        {icon && (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}

        {title && (
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-gray-600 mb-4">
            {description}
          </p>
        )}

        {children}
      </div>
    </motion.div>
  );
}
