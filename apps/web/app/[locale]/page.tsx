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
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      {/* Navigation Premium Ultra Luxe */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/95 border-b border-gray-100 shadow-2xl shadow-black/5"
      >
        {/* Gradient Border Top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo Premium */}
            <motion.div
              className="flex items-center space-x-3 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:shadow-blue-500/60 transition-all">
                  <Plane className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  {tCommon('appName')}
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                  Premium Service
                </span>
              </div>
            </motion.div>

            {/* Desktop Menu Premium */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { href: '#how-it-works', label: tNav('howItWorks') },
                { href: '#benefits', label: tNav('benefits') },
                { href: '#faq', label: 'FAQ' }
              ].map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="relative px-5 py-2 text-gray-700 hover:text-blue-600 transition-all duration-300 text-base font-medium group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.a>
              ))}
            </div>

            {/* Actions Premium */}
            <div className="flex items-center space-x-3">
              {/* Language Selector */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <LanguageSelector />
              </motion.div>

              {/* Login Button */}
              <Link
                href="/login"
                className="hidden md:flex items-center text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 text-base px-5 py-2 rounded-lg hover:bg-gray-50"
              >
                {tNav('login')}
              </Link>

              {/* Premium CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="hidden sm:flex items-center relative overflow-hidden group px-7 py-3 rounded-xl transition-all text-base font-bold"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Content */}
                  <span className="relative text-white flex items-center">
                    {tNav('register')}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl blur-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-50 group-hover:opacity-75 transition-opacity -z-10" />
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <MobileMenuButton
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </motion.nav>

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
                {t('hero.badge')}
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
                {t('hero.subtitle')}
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
                {t('hero.howItWorksButton')}
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
                <div className="text-xs sm:text-sm text-blue-200">{t('trustIndicators.successRate')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 font-mono">12K+</div>
                <div className="text-xs sm:text-sm text-blue-200">{t('trustIndicators.satisfiedClients')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1 font-mono">4.8M€</div>
                <div className="text-xs sm:text-sm text-blue-200">{t('trustIndicators.recovered')}</div>
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
              label={t('stats.claimsProcessed')}
              sublabel={t('stats.thisMonth')}
              gradient="from-blue-500 to-blue-600"
              trendIcon={<TrendingUp className="w-5 h-5" />}
              delay={0}
            />
            <StatCard
              icon={<Clock className="w-8 h-8 text-white" />}
              value={23}
              label={t('stats.inProgress')}
              sublabel={t('stats.avgDelay')}
              gradient="from-amber-500 to-orange-600"
              delay={0.1}
            />
            <StatCard
              icon={<CheckCircle className="w-8 h-8 text-white" />}
              value={89}
              label={t('stats.approvedClaims')}
              sublabel={t('stats.successRate70')}
              gradient="from-green-500 to-emerald-600"
              delay={0.2}
            />
            <StatCard
              icon={<Euro className="w-8 h-8 text-white" />}
              value={42650}
              suffix="€"
              label={t('stats.totalRecovered')}
              sublabel={t('stats.thisMonthAmount')}
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
              {t('howItWorksTitle')} {t('process.simpleAndFast')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {t('process.description')}
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
              {t('whyChooseUs.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {t('whyChooseUs.description')}
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
              {t('finalCta.title')}
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              {t('finalCta.description')}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg shadow-2xl text-lg font-semibold transition-all hover:scale-105"
            >
              {t('finalCta.button')}
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
                  {tCommon('appName')}
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                {tFooter('description')}
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">{tFooter('usefulLinks')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{tFooter('links.howItWorks')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{tFooter('links.about')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{tFooter('links.faq')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{tFooter('links.contact')}</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">{tFooter('legal')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{tFooter('legalLinks.terms')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{tFooter('legalLinks.privacy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{tFooter('legalLinks.cookies')}</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 sm:mb-0">
              {tFooter('copyright')}
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
