'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, HelpCircle, Sparkles, DollarSign, Plane } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    href: '/',
    label: 'Accueil',
    icon: Home
  },
  {
    href: '#how-it-works',
    label: 'Comment ça marche',
    icon: Sparkles
  },
  {
    href: '#airlines',
    label: 'Compagnies aériennes',
    icon: Plane
  },
  {
    href: '#benefits',
    label: 'Avantages',
    icon: Sparkles
  },
  {
    href: '#pricing',
    label: 'Tarifs',
    icon: DollarSign
  },
  {
    href: '#faq',
    label: 'FAQ',
    icon: HelpCircle
  }
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">Menu</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center group"
                  aria-label="Fermer le menu"
                >
                  <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Quick CTA */}
              <Link
                href="/register"
                onClick={handleLinkClick}
                className="block w-full bg-white text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg shadow-lg text-center font-semibold transition-all hover:scale-105"
              >
                Commencer ma réclamation
              </Link>
            </div>

            {/* Menu Items */}
            <nav className="p-6">
              <ul className="space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a
                        href={item.href}
                        onClick={handleLinkClick}
                        className="flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-600 flex items-center justify-center transition-all duration-300">
                          <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Divider */}
            <div className="mx-6 border-t border-gray-200" />

            {/* Auth Links */}
            <div className="p-6 space-y-3">
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="block w-full px-4 py-3 rounded-lg border-2 border-blue-600 text-blue-600 text-center font-medium hover:bg-blue-50 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                onClick={handleLinkClick}
                className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
              >
                S'inscrire
              </Link>
            </div>

            {/* Footer Info */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Des questions ?
                </p>
                <a
                  href="mailto:support@indemnisation-pro.com"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@indemnisation-pro.com
                </a>
                <div className="pt-4 text-xs text-gray-500">
                  © 2025 SkyLex
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
