'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles, Plane, CheckCircle, Clock, Euro, TrendingUp, Play, ChevronDown, Star, Shield, Zap, Users } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import VideoBackground from '@/components/VideoBackground';
import PremiumCard from '@/components/premium/PremiumCard';
import StatCard from '@/components/premium/StatCard';
import FAQSection from '@/components/faq/FAQSection';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import PricingSection from '@/components/pricing/PricingSection';
import AirlinesSection from '@/components/airlines/AirlinesSection';
import MobileMenu from '@/components/navigation/MobileMenu';
import MobileMenuButton from '@/components/navigation/MobileMenuButton';
import { motion } from 'framer-motion';

export default function Home() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      {/* Navigation Premium avec Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Indemnisation Pro
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors relative group text-sm font-medium">
                Comment ça marche
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all" />
              </a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors relative group text-sm font-medium">
                Avantages
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all" />
              </a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors relative group text-sm font-medium">
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all" />
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-sm hidden sm:block">
                {tNav('login')}
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/30 text-sm font-medium items-center hidden sm:flex"
              >
                {tNav('register')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              {/* Mobile Menu Button */}
              <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Hero Section avec Vidéo de Fond */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Video Background */}
        <VideoBackground
          src="/videos/hero-airplane.mp4"
          poster="/images/hero/airplane-photo.jpg"
          overlay={true}
          overlayOpacity={0.75}
          overlayGradient="from-blue-900 via-purple-900 to-blue-900"
        />

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 mr-2" />
              <span className="text-white text-sm font-medium">
                Jusqu'à 600€ d'indemnisation garantie
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight"
            >
              {t('title')}
              <span className="block bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mt-2">
                en 3 minutes chrono
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-blue-100 mb-12 max-w-2xl mx-auto"
            >
              {t('subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link
                href="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg shadow-2xl shadow-white/20 text-lg font-semibold flex items-center transition-all hover:scale-105"
              >
                <Plane className="mr-2 w-5 h-5" />
                {t('ctaButton')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-md px-8 py-4 rounded-lg text-lg font-semibold flex items-center transition-all">
                <Play className="mr-2 w-5 h-5" />
                Comment ça marche
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/20"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 font-mono">98%</div>
                <div className="text-xs sm:text-sm text-blue-200">Taux de succès</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 font-mono">12K+</div>
                <div className="text-xs sm:text-sm text-blue-200">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 font-mono">4.8M€</div>
                <div className="text-xs sm:text-sm text-blue-200">Récupérés</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
        >
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<CheckCircle className="w-8 h-8 text-white" />}
              value={127}
              label="Réclamations traitées"
              sublabel="+12% ce mois"
              gradient="from-blue-500 to-blue-600"
              trendIcon={<TrendingUp className="w-5 h-5" />}
              delay={0}
            />
            <StatCard
              icon={<Clock className="w-8 h-8 text-white" />}
              value={23}
              label="En cours de traitement"
              sublabel="Délai moyen 48h"
              gradient="from-amber-500 to-orange-600"
              delay={0.1}
            />
            <StatCard
              icon={<CheckCircle className="w-8 h-8 text-white" />}
              value={89}
              label="Réclamations approuvées"
              sublabel="70% de taux de succès"
              gradient="from-green-500 to-emerald-600"
              delay={0.2}
            />
            <StatCard
              icon={<Euro className="w-8 h-8 text-white" />}
              value={42650}
              suffix="€"
              label="Montant total récupéré"
              sublabel="+8,500€ ce mois"
              gradient="from-purple-500 to-pink-600"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How it Works - 3 Steps */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              {t('step1Title')} simple et rapide
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              En seulement 3 étapes, récupérez votre indemnisation
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PremiumCard
              icon={<span className="text-2xl font-bold text-white">1</span>}
              title={t('step1Title')}
              description={t('step1Description')}
              hover={true}
              gradient={true}
            />
            <PremiumCard
              icon={<span className="text-2xl font-bold text-white">2</span>}
              title={t('step2Title')}
              description={t('step2Description')}
              hover={true}
              gradient={true}
            />
            <PremiumCard
              icon={<span className="text-2xl font-bold text-white">3</span>}
              title={t('step3Title')}
              description={t('step3Description')}
              hover={true}
              gradient={true}
            />
          </div>
        </div>
      </section>

      {/* Airlines Section */}
      <AirlinesSection />

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
            >
              Pourquoi nous choisir ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Des milliers de passagers nous font confiance
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PremiumCard
              icon={<Zap className="w-8 h-8 text-white" />}
              title={t('feature1Title')}
              description={t('feature1Description')}
              hover={true}
            />
            <PremiumCard
              icon={<Shield className="w-8 h-8 text-white" />}
              title={t('feature2Title')}
              description={t('feature2Description')}
              hover={true}
            />
            <PremiumCard
              icon={<Users className="w-8 h-8 text-white" />}
              title={t('feature3Title')}
              description={t('feature3Description')}
              hover={true}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Final Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
              Prêt à récupérer votre argent ?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              Rejoignez des milliers de passagers qui ont déjà récupéré leur indemnisation
            </p>
            <Link
              href="/register"
              className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg shadow-2xl text-lg font-semibold transition-all hover:scale-105"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Indemnisation Pro
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                La plateforme de référence pour récupérer votre indemnisation en cas de vol retardé, annulé ou surréservé.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Liens utiles</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nos tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 sm:mb-0">
              © 2025 Indemnisation Pro. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
