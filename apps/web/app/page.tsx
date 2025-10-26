import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" suppressHydrationWarning>
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Indemnisation Vols</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              Connexion
            </Link>
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Réclamez jusqu'à 600€ pour votre vol retardé
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Votre vol a été retardé, annulé ou surbooké ? Vous avez droit à une indemnisation.
            Nous nous occupons de tout.
          </p>
          <Link href="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
            Vérifier mon éligibilité
          </Link>
        </div>

        {/* Comment ça marche */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Remplissez le formulaire</h3>
            <p className="text-gray-600">
              Entrez les détails de votre vol en 2 minutes
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Nous traitons votre dossier</h3>
            <p className="text-gray-600">
              Notre équipe s'occupe de toutes les démarches
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Recevez votre indemnisation</h3>
            <p className="text-gray-600">
              Nous ne prenons une commission que si nous gagnons
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Plus de 10 000 passagers nous font confiance</p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
            <span>🔒 Paiement sécurisé</span>
            <span>⚡ Traitement rapide</span>
            <span>✅ Pas de frais si échec</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2025 Indemnisation Vols. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
