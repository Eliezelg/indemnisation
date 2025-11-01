'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('verifyEmail');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setErrorMessage(t('invalidToken'));
        return;
      }

      try {
        const response = await fetch(
          `https://indem.webpro200.com/api/auth/verify-email?token=${token}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t('invalidToken'));
        }

        setStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || t('invalidToken'));
      }
    };

    verifyEmail();
  }, [searchParams, router, t]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          {t('title')}
        </h1>

        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('verifying')}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <svg
                className="w-16 h-16 text-green-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                {t('success')}
              </h2>
              <p className="text-green-700">{t('successMessage')}</p>
            </div>
            <p className="text-sm text-gray-500">
              Redirection automatique vers la page de connexion...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-red-900 mb-2">
                {t('error')}
              </h2>
              <p className="text-red-700">{errorMessage}</p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              {t('goToLogin')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
