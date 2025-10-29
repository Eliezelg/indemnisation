'use client';

import { motion } from 'framer-motion';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      aria-expanded={isOpen}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        {/* Top Line */}
        <motion.span
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 8 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full h-0.5 bg-gray-700 rounded-full origin-center"
        />

        {/* Middle Line */}
        <motion.span
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? -10 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full h-0.5 bg-gray-700 rounded-full"
        />

        {/* Bottom Line */}
        <motion.span
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -8 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full h-0.5 bg-gray-700 rounded-full origin-center"
        />
      </div>
    </button>
  );
}
