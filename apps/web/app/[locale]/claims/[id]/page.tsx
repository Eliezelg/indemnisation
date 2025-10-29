'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSelector from '@/components/LanguageSelector';
import FileUpload from '@/components/FileUpload';
import DocumentList from '@/components/DocumentList';
import MessageThread from '@/components/MessageThread';
import { DocumentType } from '@/types/document';

interface Claim {
  id: string;
  claimNumber: string;
  flightNumber: string;
  flightDate: string;
  departureAirport: string;
  arrivalAirport: string;
  airline?: string;
  disruptionType: string;
  delayMinutes?: number;
  status: string;
  recommendedAmount: number;
  calculatedAmountEU?: number;
  calculatedAmountIL?: number;
  jurisdiction: string;
  distance: number;
  passengerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bookingReference?: string;
  };
  createdAt: string;
  submittedAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  IN_REVIEW: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  PAID: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

export default function ClaimDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations('claimDetail');
  const tDocs = useTranslations('documents');
  const tStatus = useTranslations('status');
  const tDisruption = useTranslations('disruption');
  const tCommon = useTranslations('common');
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('USER');

  useEffect(() => {
    const fetchClaim = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/login');
        return;
      }

      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.sub);
        setUserRole(payload.role || 'USER');
      } catch (e) {
        console.error('Failed to decode token', e);
      }

      try {
        const response = await fetch(`http://localhost:3001/claims/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(t('notFound'));
        }

        const data = await response.json();
        setClaim(data);
      } catch (err: any) {
        setError(err.message || tCommon('error'));
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchClaim();
    }
  }, [params.id, router]);

  const handleSubmit = async () => {
    if (!claim) return;

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`http://localhost:3001/claims/${claim.id}/submit`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t('submitError'));
      }

      const data = await response.json();
      setClaim(data);
      alert(t('submitSuccess'));
    } catch (err: any) {
      setError(err.message || tCommon('error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || t('notFound')}</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            {t('backToList')}
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[claim.status] || 'bg-gray-100 text-gray-700';
  const statusLabel = tStatus(claim.status.toLowerCase());
  const disruptionLabel = tDisruption(claim.disruptionType.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            {t('appTitle')}
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              ← {t('backToList')}
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('claimTitle')} {claim.claimNumber}
                </h1>
                <p className="text-gray-600">
                  {t('flight')} {claim.flightNumber} • {claim.departureAirport} → {claim.arrivalAirport}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor}`}>
                {statusLabel}
              </span>
            </div>

            {/* Compensation Amount */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 text-center mb-2">{t('recommendedAmount')}</p>
              <p className="text-5xl font-bold text-blue-600 text-center">
                €{claim.recommendedAmount}
              </p>
              {claim.calculatedAmountIL && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  ({t('or')} ₪{claim.calculatedAmountIL})
                </p>
              )}
            </div>

            {/* Submit Button */}
            {claim.status === 'DRAFT' && (
              <div className="mb-6">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-blue-300"
                >
                  {submitting ? t('submitting') : t('submitButton')}
                </button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  {t('submitWarning')}
                </p>
              </div>
            )}
          </div>

          {/* Flight Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('flightInfo')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('flightNumber')}</p>
                <p className="font-semibold">{claim.flightNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('flightDate')}</p>
                <p className="font-semibold">{new Date(claim.flightDate).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('departure')}</p>
                <p className="font-semibold">{claim.departureAirport}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('arrival')}</p>
                <p className="font-semibold">{claim.arrivalAirport}</p>
              </div>
              {claim.airline && (
                <div>
                  <p className="text-sm text-gray-500">{t('airline')}</p>
                  <p className="font-semibold">{claim.airline}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">{t('distance')}</p>
                <p className="font-semibold">{claim.distance} km</p>
              </div>
            </div>
          </div>

          {/* Disruption Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('disruptionInfo')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('type')}</p>
                <p className="font-semibold">{disruptionLabel}</p>
              </div>
              {claim.delayMinutes && (
                <div>
                  <p className="text-sm text-gray-500">{t('delayDuration')}</p>
                  <p className="font-semibold">
                    {Math.floor(claim.delayMinutes / 60)}h {claim.delayMinutes % 60}{t('minutes')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Passenger Info */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('passengerInfo')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('fullName')}</p>
                <p className="font-semibold">
                  {claim.passengerInfo.firstName} {claim.passengerInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('email')}</p>
                <p className="font-semibold">{claim.passengerInfo.email}</p>
              </div>
              {claim.passengerInfo.phone && (
                <div>
                  <p className="text-sm text-gray-500">{t('phone')}</p>
                  <p className="font-semibold">{claim.passengerInfo.phone}</p>
                </div>
              )}
              {claim.passengerInfo.bookingReference && (
                <div>
                  <p className="text-sm text-gray-500">{t('bookingRef')}</p>
                  <p className="font-semibold">{claim.passengerInfo.bookingReference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Compensation Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('compensationInfo')}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">{t('jurisdiction')}</p>
                <p className="font-semibold">{claim.jurisdiction}</p>
              </div>
              {claim.calculatedAmountEU && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">{t('euRegulation')}</p>
                  <p className="font-semibold text-lg text-blue-600">€{claim.calculatedAmountEU}</p>
                </div>
              )}
              {claim.calculatedAmountIL && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">{t('israelLaw')}</p>
                  <p className="font-semibold text-lg text-blue-600">
                    ₪{claim.calculatedAmountIL} (≈ €{Math.round(Number(claim.calculatedAmountIL) / 4)})
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{tDocs('uploadedDocuments')}</h2>

            {/* Document List */}
            <div className="mb-6">
              <DocumentList claimId={claim.id} />
            </div>

            {/* Upload New Documents (only if not submitted) */}
            {claim.status === 'DRAFT' && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{tDocs('uploadDocuments')}</h3>
                <div className="space-y-4">
                  <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer font-medium text-gray-900">
                      {tDocs('boardingPass')} <span className="text-red-500">*</span>
                    </summary>
                    <div className="mt-4">
                      <FileUpload
                        claimId={claim.id}
                        documentType={DocumentType.BOARDING_PASS}
                      />
                    </div>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer font-medium text-gray-900">
                      {tDocs('bookingConfirmation')}
                    </summary>
                    <div className="mt-4">
                      <FileUpload
                        claimId={claim.id}
                        documentType={DocumentType.BOOKING_CONFIRMATION}
                      />
                    </div>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer font-medium text-gray-900">
                      {tDocs('idDocument')}
                    </summary>
                    <div className="mt-4">
                      <FileUpload
                        claimId={claim.id}
                        documentType={DocumentType.ID_DOCUMENT}
                      />
                    </div>
                  </details>

                  {claim.disruptionType === 'DELAY' && (
                    <details className="border border-gray-200 rounded-lg p-4">
                      <summary className="cursor-pointer font-medium text-gray-900">
                        {tDocs('proofOfDelay')}
                      </summary>
                      <div className="mt-4">
                        <FileUpload
                          claimId={claim.id}
                          documentType={DocumentType.PROOF_OF_DELAY}
                        />
                      </div>
                    </details>
                  )}

                  <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="cursor-pointer font-medium text-gray-900">
                      {tDocs('other')}
                    </summary>
                    <div className="mt-4">
                      <FileUpload
                        claimId={claim.id}
                        documentType={DocumentType.OTHER}
                      />
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          {claim.status !== 'DRAFT' && userId && (
            <div className="mb-6">
              <MessageThread
                claimId={claim.id}
                currentUserId={userId}
                currentUserRole={userRole}
              />
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('timeline')}</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="font-semibold">{t('claimCreated')}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(claim.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
              {claim.submittedAt && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-semibold">{t('claimSubmitted')}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(claim.submittedAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
