'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified: boolean;
}

interface Claim {
  id: string;
  claimNumber: string;
  flightNumber: string;
  flightDate: string;
  departureAirport: string;
  arrivalAirport: string;
  disruptionType: string;
  status: string;
  recommendedAmount: number;
  jurisdiction: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'gray',
  SUBMITTED: 'blue',
  IN_REVIEW: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
  PAID: 'green',
  CANCELLED: 'gray',
};

export default function DashboardPage() {
  const router = useRouter();
  const t = useTranslations('dashboard');
  const tStatus = useTranslations('status');
  const tDisruption = useTranslations('disruption');
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [userRes, claimsRes] = await Promise.all([
          fetch('http://localhost:3001/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch('http://localhost:3001/claims', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        if (!userRes.ok) {
          throw new Error('Unauthorized');
        }

        const userData = await userRes.json();
        setUser(userData);

        if (claimsRes.ok) {
          const claimsData = await claimsRes.json();
          setClaims(claimsData);
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">{t('appTitle')}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            {t('logout')}
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('greeting', { firstName: user.firstName, lastName: user.lastName })}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('welcome')}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">{t('accountInfo')}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">{t('email')}:</span> {user.email}</p>
                  <p><span className="text-gray-500">{t('phone')}:</span> {user.phone || t('notProvided')}</p>
                  <p>
                    <span className="text-gray-500">{t('status')}:</span>{' '}
                    {user.emailVerified ? (
                      <span className="text-green-600 font-semibold">{t('verified')}</span>
                    ) : (
                      <span className="text-orange-600 font-semibold">{t('notVerified')}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">{t('statistics')}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">{t('totalClaims')}:</span> {claims.length}</p>
                  <p><span className="text-gray-500">{t('inProgress')}:</span> {claims.filter(c => c.status === 'SUBMITTED' || c.status === 'IN_REVIEW').length}</p>
                  <p><span className="text-gray-500">{t('approved')}:</span> {claims.filter(c => c.status === 'APPROVED' || c.status === 'PAID').length}</p>
                </div>
              </div>

              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h3 className="font-semibold text-blue-900 mb-2">{t('newClaim')}</h3>
                <p className="text-sm text-blue-700 mb-4">
                  {t('newClaimDescription')}
                </p>
                <Link
                  href="/claims/new"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-center transition-colors"
                >
                  {t('createClaim')}
                </Link>
              </div>
            </div>
          </div>

          {/* Claims List */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t('myClaims')}
            </h3>

            {claims.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mb-4">{t('noClaims')}</p>
                <Link
                  href="/claims/new"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                >
                  {t('createFirstClaim')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {claims.map((claim) => {
                  const statusColor = STATUS_COLORS[claim.status] || 'gray';
                  const statusLabel = tStatus(claim.status.toLowerCase());
                  const disruptionLabel = tDisruption(claim.disruptionType.toLowerCase());

                  return (
                    <div key={claim.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {claim.flightNumber}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {claim.departureAirport} → {claim.arrivalAirport}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${statusColor}-100 text-${statusColor}-700`}>
                          {statusLabel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">{t('claimNumber')}:</span>
                          <p className="font-medium">{claim.claimNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('flightDate')}:</span>
                          <p className="font-medium">{new Date(claim.flightDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('type')}:</span>
                          <p className="font-medium">{disruptionLabel}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{t('amount')}:</span>
                          <p className="font-medium text-blue-600">€{claim.recommendedAmount}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          {t('createdOn')} {new Date(claim.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        <Link
                          href={`/claims/${claim.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          {t('viewDetails')} →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
