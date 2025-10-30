'use client';

import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

interface Airline {
  name: string;
  code: string;
  logo: string;
}

const airlines: Airline[] = [
  {
    name: 'Air France',
    code: 'AF',
    logo: 'https://images.kiwi.com/airlines/64/AF.png'
  },
  {
    name: 'Ryanair',
    code: 'FR',
    logo: 'https://images.kiwi.com/airlines/64/FR.png'
  },
  {
    name: 'EasyJet',
    code: 'U2',
    logo: 'https://images.kiwi.com/airlines/64/U2.png'
  },
  {
    name: 'Lufthansa',
    code: 'LH',
    logo: 'https://images.kiwi.com/airlines/64/LH.png'
  },
  {
    name: 'El Al',
    code: 'LY',
    logo: 'https://images.kiwi.com/airlines/64/LY.png'
  },
  {
    name: 'Wizz Air',
    code: 'W6',
    logo: 'https://images.kiwi.com/airlines/64/W6.png'
  },
  {
    name: 'Vueling',
    code: 'VY',
    logo: 'https://images.kiwi.com/airlines/64/VY.png'
  },
  {
    name: 'Transavia',
    code: 'HV',
    logo: 'https://images.kiwi.com/airlines/64/HV.png'
  },
  {
    name: 'British Airways',
    code: 'BA',
    logo: 'https://images.kiwi.com/airlines/64/BA.png'
  },
  {
    name: 'KLM',
    code: 'KL',
    logo: 'https://images.kiwi.com/airlines/64/KL.png'
  },
  {
    name: 'Iberia',
    code: 'IB',
    logo: 'https://images.kiwi.com/airlines/64/IB.png'
  },
  {
    name: 'Turkish Airlines',
    code: 'TK',
    logo: 'https://images.kiwi.com/airlines/64/TK.png'
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
                  {/* Airline Logo */}
                  <img
                    src={airline.logo}
                    alt={airline.name}
                    className="w-full h-auto max-w-[80px] max-h-[80px] object-contain mx-auto group-hover:scale-110 transition-transform duration-300"
                  />

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
