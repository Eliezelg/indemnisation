'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface StatCardProps {
  icon: ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  gradient: string;
  trendIcon?: ReactNode;
  delay?: number;
}

export default function StatCard({
  icon,
  value,
  suffix = '',
  prefix = '',
  label,
  sublabel,
  gradient,
  trendIcon,
  delay = 0,
}: StatCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1`}
    >
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />

      <div className="relative">
        {/* Icon and Trend */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 flex items-center justify-center opacity-80">
            {icon}
          </div>
          {trendIcon && (
            <div className="w-8 h-8 flex items-center justify-center opacity-50">
              {trendIcon}
            </div>
          )}
        </div>

        {/* Value with CountUp animation */}
        <div className="text-3xl md:text-4xl font-bold mb-1 font-mono">
          {inView && (
            <>
              {prefix}
              <CountUp
                end={value}
                duration={2}
                separator=","
                decimals={prefix === '€' || suffix === '€' ? 0 : 0}
              />
              {suffix}
            </>
          )}
        </div>

        {/* Label */}
        <div className="text-sm opacity-90 mb-2">
          {label}
        </div>

        {/* Sublabel */}
        {sublabel && (
          <div className="text-xs opacity-75 mt-3">
            {sublabel}
          </div>
        )}
      </div>
    </motion.div>
  );
}
