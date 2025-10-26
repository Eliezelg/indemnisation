import Link from 'next/link';
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" suppressHydrationWarning>
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Indemnisation Vols</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
              {tNav('login')}
            </Link>
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
              {tNav('register')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('subtitle')}
          </p>
          <Link href="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
            {t('ctaButton')}
          </Link>
        </div>

        {/* Comment ça marche */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('step1Title')}</h3>
            <p className="text-gray-600">
              {t('step1Description')}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('step2Title')}</h3>
            <p className="text-gray-600">
              {t('step2Description')}
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('step3Title')}</h3>
            <p className="text-gray-600">
              {t('step3Description')}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold mb-2">{t('feature1Title')}</h4>
            <p className="text-gray-600">{t('feature1Description')}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold mb-2">{t('feature2Title')}</h4>
            <p className="text-gray-600">{t('feature2Description')}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold mb-2">{t('feature3Title')}</h4>
            <p className="text-gray-600">{t('feature3Description')}</p>
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
