'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Combien puis-je recevoir d'indemnisation ?",
    answer: "Selon la réglementation CE 261/2004, vous pouvez recevoir entre 250€ et 600€ par passager selon la distance du vol : 250€ pour les vols de moins de 1500 km, 400€ pour les vols entre 1500 et 3500 km, et 600€ pour les vols de plus de 3500 km. Pour la législation israélienne, les montants varient selon des critères similaires."
  },
  {
    question: "Quels types de perturbations sont couverts ?",
    answer: "Nous couvrons les vols retardés (plus de 3 heures), les vols annulés, et les cas de surréservation (refus d'embarquement). Les perturbations doivent être de la responsabilité de la compagnie aérienne et non liées à des circonstances extraordinaires comme les conditions météorologiques extrêmes."
  },
  {
    question: "Combien de temps prend le processus ?",
    answer: "Le processus complet prend généralement entre 2 et 8 semaines. Après soumission de votre réclamation, notre équipe juridique l'examine sous 48h. Nous contactons ensuite la compagnie aérienne et négocions en votre nom. Le délai dépend de la réactivité de la compagnie."
  },
  {
    question: "Est-ce vraiment sans frais si je perds ?",
    answer: "Absolument ! Nous fonctionnons sur une base de « pas de gain, pas de frais ». Vous ne payez rien si votre réclamation n'aboutit pas. Notre commission de 25% (TVA incluse) n'est prélevée que si nous récupérons votre indemnisation avec succès."
  },
  {
    question: "De quels documents ai-je besoin ?",
    answer: "Vous aurez besoin de votre carte d'embarquement ou confirmation de réservation, et de tout document prouvant le retard ou l'annulation (email de la compagnie, photos, etc.). Si vous ne les avez pas tous, pas de panique ! Nous pouvons souvent les obtenir directement auprès de la compagnie aérienne."
  },
  {
    question: "Puis-je réclamer pour un vol ancien ?",
    answer: "Oui, vous avez jusqu'à 5 ans après la date du vol pour faire votre réclamation selon la législation européenne. En Israël, le délai est de 7 ans. Cependant, plus vous agissez tôt, plus le processus est rapide et les chances de succès élevées."
  },
  {
    question: "Que se passe-t-il si la compagnie refuse ?",
    answer: "Si la compagnie aérienne refuse votre réclamation, nous ne baissons pas les bras ! Nous pouvons faire appel à des organismes de médiation ou engager une procédure judiciaire si nécessaire. Nos avocats spécialisés gèrent tout le processus à vos côtés."
  },
  {
    question: "Comment êtes-vous rémunérés ?",
    answer: "Notre rémunération est simple et transparente : nous prenons une commission de 25% (TVA incluse) uniquement sur le montant récupéré. Si vous recevez 600€, vous gardez 450€ et nous prenons 150€. Aucun frais caché, aucun frais d'avance."
  },
  {
    question: "Quelle est la différence avec d'autres services ?",
    answer: "Nous nous distinguons par notre expertise juridique (équipe d'avocats spécialisés), notre taux de succès de 98%, notre support multilingue (français, anglais, hébreu), et notre transparence totale. Nous traitons aussi bien la législation européenne qu'israélienne, ce qui est rare."
  },
  {
    question: "Puis-je suivre l'avancement de ma réclamation ?",
    answer: "Oui ! Vous avez accès à un tableau de bord personnel où vous pouvez suivre votre réclamation en temps réel. Vous recevez également des notifications par email à chaque étape importante : soumission, examen, contact compagnie, négociation, et paiement."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
              Questions Fréquentes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur l'indemnisation des vols perturbés
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
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
                      {faq.question}
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
                          {faq.answer}
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
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="text-gray-600 mb-6">
              Notre équipe est là pour vous aider 24/7
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:support@indemnisation-pro.com"
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
              >
                Contactez-nous
              </a>
              <a
                href="/register"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
              >
                Commencer ma réclamation
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
