'use client';

import { motion } from 'framer-motion';
import { Star, Check, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Testimonial {
  name: string;
  location: string;
  initials: string;
  quote: string;
  amount: string;
  rating: number;
}

const testimonialAuthors = [
  {
    name: "Sophie Martin",
    location: "Paris, France",
    initials: "SM",
    rating: 5,
    index: 0
  },
  {
    name: "David Cohen",
    location: "Tel Aviv, Israël",
    initials: "DC",
    rating: 5,
    index: 1
  },
  {
    name: "Marie Dubois",
    location: "Lyon, France",
    initials: "MD",
    rating: 5,
    index: 2
  }
];

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/30">
            <Quote className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonialAuthors.map((author) => {
            const quote = t(`items.${author.index}.quote`);
            const amount = t(`items.${author.index}.amount`);

            return (
              <motion.div
                key={author.index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: author.index * 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Stars Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(author.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 mb-6 italic leading-relaxed relative">
                  <span className="absolute -top-2 -left-2 text-4xl text-blue-200 opacity-50">"</span>
                  {quote}
                  <span className="absolute -bottom-4 text-4xl text-blue-200 opacity-50">"</span>
                </p>

                {/* Author */}
                <div className="flex items-center space-x-4 mb-6 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {author.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {author.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {author.location}
                    </div>
                  </div>
                </div>

                {/* Amount Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  <Check className="w-4 h-4 mr-1" />
                  {amount} {t('recovered')}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center"
        >
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-mono">
              98%
            </div>
            <div className="text-sm text-gray-600">{t('stats.successRate')}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-mono">
              4.8/5
            </div>
            <div className="text-sm text-gray-600">{t('stats.satisfiedClients')}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-mono">
              12K+
            </div>
            <div className="text-sm text-gray-600">{t('stats.satisfiedClients')}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-mono">
              24-48h
            </div>
            <div className="text-sm text-gray-600">{t('stats.avgTime')}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
