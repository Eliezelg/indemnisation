'use client';

import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

interface Airline {
  name: string;
  logo: string;
  gradient: string;
}

const airlines: Airline[] = [
  {
    name: 'Air France',
    logo: 'AF',
    gradient: 'from-blue-600 to-blue-800'
  },
  {
    name: 'Ryanair',
    logo: 'FR',
    gradient: 'from-yellow-500 to-blue-600'
  },
  {
    name: 'EasyJet',
    logo: 'EJ',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    name: 'Lufthansa',
    logo: 'LH',
    gradient: 'from-yellow-400 to-blue-600'
  },
  {
    name: 'El Al',
    logo: 'LY',
    gradient: 'from-blue-500 to-blue-700'
  },
  {
    name: 'Wizz Air',
    logo: 'W6',
    gradient: 'from-pink-500 to-purple-600'
  },
  {
    name: 'Vueling',
    logo: 'VY',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    name: 'Transavia',
    logo: 'HV',
    gradient: 'from-green-500 to-green-700'
  },
  {
    name: 'British Airways',
    logo: 'BA',
    gradient: 'from-blue-800 to-red-600'
  },
  {
    name: 'KLM',
    logo: 'KL',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    name: 'Iberia',
    logo: 'IB',
    gradient: 'from-red-500 to-yellow-400'
  },
  {
    name: 'Turkish Airlines',
    logo: 'TK',
    gradient: 'from-red-600 to-red-800'
  }
];

export default function AirlinesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg shadow-blue-500/30">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Compagnies Aériennes Couvertes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nous traitons les réclamations pour toutes les compagnies aériennes opérant en Europe et Israël
          </p>
        </motion.div>

        {/* Airlines Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {airlines.map((airline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  {/* Logo Circle */}
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${airline.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg">
                      {airline.logo}
                    </span>
                  </div>

                  {/* Airline Name */}
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                      {airline.name}
                    </h3>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white shadow-lg border border-gray-200">
              <Plane className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">
                <span className="font-semibold text-blue-600">Et bien d'autres...</span> Nous couvrons toutes les compagnies aériennes opérant en Europe et Israël
              </span>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-mono">
              500+
            </div>
            <div className="text-sm text-gray-600">Compagnies aériennes</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-mono">
              100%
            </div>
            <div className="text-sm text-gray-600">Couverture Europe & Israël</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 font-mono">
              24/7
            </div>
            <div className="text-sm text-gray-600">Support disponible</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
