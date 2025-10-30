'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations('faq');

  // Get the number of FAQ items from translations
  const faqCount = 10; // We have 10 FAQ items in translations

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/30">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {Array.from({ length: faqCount }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`
                    border rounded-xl transition-all duration-300
                    ${openIndex === index
                      ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-md'
                    }
                  `}
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                  >
                    <span className={`
                      font-semibold text-gray-900 pr-4 transition-colors
                      ${openIndex === index ? 'text-blue-600' : 'group-hover:text-blue-600'}
                    `}>
                      {t(`items.${index}.question`)}
                    </span>
                    <ChevronDown
                      className={`
                        w-5 h-5 flex-shrink-0 transition-all duration-300
                        ${openIndex === index
                          ? 'rotate-180 text-blue-600'
                          : 'text-gray-400 group-hover:text-blue-600'
                        }
                      `}
                    />
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-200/50 pt-4">
                          {t(`items.${index}.answer`)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA at the end */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center p-8 rounded-2xl bg-gradient-card border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('notFoundQuestion')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('support247')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@indemnisation-pro.com"
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                {t('contactUs')}
              </a>
              <a
                href="/register"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
              >
                {t('startClaim')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
