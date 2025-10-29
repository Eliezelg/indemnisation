'use client';

import { motion } from 'framer-motion';
import { Check, X, DollarSign, Shield, TrendingUp, AlertCircle } from 'lucide-react';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-lg shadow-green-500/30">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Tarification Transparente
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aucun frais à l'avance. Vous ne payez que si nous gagnons.
          </p>
        </motion.div>

        {/* Main Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 border-2 border-blue-200 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
                <Shield className="w-4 h-4 mr-2" />
                Garantie "Pas de gain, pas de frais"
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                25% <span className="text-2xl text-gray-600">de commission</span>
              </h3>
              <p className="text-lg text-gray-600">
                Uniquement prélevée sur le montant récupéré (TVA incluse)
              </p>
            </div>

            {/* Example Calculation */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Exemple concret
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2 font-mono">
                    600€
                  </div>
                  <div className="text-sm text-gray-600">
                    Indemnisation récupérée
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Vous recevez</span>
                    <span className="text-2xl font-bold text-green-600 font-mono">450€</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Notre commission</span>
                    <span className="text-lg font-semibold text-gray-900 font-mono">150€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Aucun frais à l'avance</div>
                  <div className="text-sm text-gray-600">Vous ne payez rien tant que nous n'avons pas gagné</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Pas de frais cachés</div>
                  <div className="text-sm text-gray-600">Le prix indiqué est le prix final, TVA incluse</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Tout compris</div>
                  <div className="text-sm text-gray-600">Frais juridiques, procédures, négociations incluses</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Garantie satisfait ou remboursé</div>
                  <div className="text-sm text-gray-600">Si nous ne récupérons rien, vous ne payez rien</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Comparaison avec d'autres solutions
          </h3>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Critère
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
                      Indemnisation Pro
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Autres services
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Faire seul
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Frais à l'avance
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <X className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="ml-2 text-sm text-green-600 font-medium">0€</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <X className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="ml-2 text-sm text-green-600 font-medium">0€</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <X className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="ml-2 text-sm text-green-600 font-medium">0€</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Commission si succès
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-blue-600">25%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-600">25-35%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-green-600 font-medium">0%</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Assistance juridique
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Taux de succès
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-green-600">98%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-600">85-95%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-600">20-40%</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Temps nécessaire
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-blue-600 font-medium">5 min</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-600">10-15 min</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-600">5-10h</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Support multilingue
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-green-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-400">Parfois</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50 transition-colors bg-blue-50/50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                      Recommandé
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold">
                        MEILLEUR CHOIX
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-400">Alternative</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-400">Difficile</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Pourquoi choisir Indemnisation Pro ?
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Notre commission de 25% inclut tous les services : analyse juridique, négociation avec la compagnie aérienne,
                procédures en cas de refus, et suivi personnalisé. Avec un taux de succès de 98%, nous maximisons vos chances
                de récupérer votre indemnisation sans aucun risque financier pour vous.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
