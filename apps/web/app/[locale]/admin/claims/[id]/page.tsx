'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  FileText,
  User,
  Plane,
  Calendar,
  MapPin,
  Clock,
  Euro,
  MessageSquare,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Claim {
  id: string;
  claimNumber: string;
  status: string;
  flightNumber: string;
  flightDate: string;
  departureAirport: string;
  arrivalAirport: string;
  airline: string;
  disruptionType: string;
  delayDuration: number | null;
  numberOfPassengers: number;
  recommendedAmount: number;
  hasContactedCompany: boolean;
  companyContactDetails: string | null;
  additionalExpenses: Array<{
    type: string;
    amount: string;
    description: string;
  }> | null;
  createdAt: string;
  submittedAt: string | null;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    birthDate: string | null;
    nationality: string | null;
  };
  documents: Array<{
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    documentType: string;
    uploadedAt: string;
  }>;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  PAID: 'bg-purple-100 text-purple-800',
};

export default function AdminClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id, locale } = params;
  const t = useTranslations('admin');
  const tStatus = useTranslations('status');

  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) {
      fetchClaim();
    }
  }, [id]);

  const handleDownloadDocument = async (documentId: string, fileName: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `https://indem.webpro200.com/api/admin/documents/${documentId}/download`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(t('downloadError'));
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (err: any) {
      alert(err.message || t('downloadError'));
    }
  };

  const fetchClaim = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://indem.webpro200.com/api/admin/claims/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClaim(data);
      }
    } catch (error) {
      console.error(t('loadClaimError'), error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!claim) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://indem.webpro200.com/api/claims/${claim.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchClaim();
        alert(`${t('statusUpdated')}: ${tStatus(newStatus.toLowerCase())}`);
      }
    } catch (error) {
      console.error(t('updateError'), error);
      alert(t('statusUpdateError'));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">{t('notFound')}</h3>
        <div className="mt-6">
          <Link
            href={`/${locale}/admin/claims`}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {t('backToList')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{claim.claimNumber}</h1>
          <p className="text-gray-600 mt-1">{t('claimDetails')}</p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[claim.status]
          }`}
        >
          {tStatus(claim.status.toLowerCase())}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du vol */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plane size={20} />
              {t('flightInfo')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">{t('flightNumber')}</div>
                <div className="font-medium font-mono">{claim.flightNumber}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('airline')}</div>
                <div className="font-medium">{claim.airline}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('flightDate')}</div>
                <div className="font-medium flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(claim.flightDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('disruptionType')}</div>
                <div className="font-medium">{claim.disruptionType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('numberOfPassengers')}</div>
                <div className="font-medium flex items-center gap-2">
                  <User size={16} />
                  {claim.numberOfPassengers} {claim.numberOfPassengers > 1 ? t('passengers') : t('passenger')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('departureAirport')}</div>
                <div className="font-medium flex items-center gap-2">
                  <MapPin size={16} />
                  {claim.departureAirport}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('arrivalAirport')}</div>
                <div className="font-medium flex items-center gap-2">
                  <MapPin size={16} />
                  {claim.arrivalAirport}
                </div>
              </div>
              {claim.delayDuration && (
                <div>
                  <div className="text-sm text-gray-500">{t('delayDuration')}</div>
                  <div className="font-medium flex items-center gap-2">
                    <Clock size={16} />
                    {claim.delayDuration} {t('minutes')}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-500">{t('recommendedAmount')}</div>
                <div className="font-medium text-green-600 flex items-center gap-2">
                  <Euro size={16} />
                  {claim.recommendedAmount ? Number(claim.recommendedAmount).toFixed(2) : '0.00'} €
                </div>
              </div>
            </div>
          </div>

          {/* Informations du passager */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              {t('passengerInfo')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">{t('fullName')}</div>
                <div className="font-medium">
                  {claim.user.firstName} {claim.user.lastName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('email')}</div>
                <div className="font-medium">{claim.user.email}</div>
              </div>
              {claim.user.phone && (
                <div>
                  <div className="text-sm text-gray-500">{t('phone')}</div>
                  <div className="font-medium">{claim.user.phone}</div>
                </div>
              )}
              {claim.user.birthDate && (
                <div>
                  <div className="text-sm text-gray-500">{t('birthDate')}</div>
                  <div className="font-medium">
                    {new Date(claim.user.birthDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              )}
              {claim.user.nationality && (
                <div>
                  <div className="text-sm text-gray-500">{t('nationality')}</div>
                  <div className="font-medium">{claim.user.nationality}</div>
                </div>
              )}
            </div>
          </div>

          {/* Contact avec la compagnie */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              {t('companyContact')}
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">{t('hasContactedCompany')}</div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  claim.hasContactedCompany
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {claim.hasContactedCompany ? (
                    <>
                      <Check size={16} />
                      {t('yes')}
                    </>
                  ) : (
                    <>
                      <X size={16} />
                      {t('no')}
                    </>
                  )}
                </div>
              </div>
              {claim.hasContactedCompany && claim.companyContactDetails && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">{t('contactDetails')}</div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">
                    {claim.companyContactDetails}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Frais supplémentaires */}
          {claim.additionalExpenses && claim.additionalExpenses.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Euro size={20} />
                {t('additionalExpenses')}
              </h2>
              <div className="space-y-3">
                {claim.additionalExpenses.map((expense, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">{t('expenseType')}</div>
                        <div className="font-medium">{expense.type}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{t('expenseAmount')}</div>
                        <div className="font-medium text-green-600">{expense.amount} €</div>
                      </div>
                      <div className="col-span-1">
                        <div className="text-sm text-gray-500">{t('expenseDescription')}</div>
                        <div className="text-sm">{expense.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-700">{t('totalExpenses')}</div>
                    <div className="text-lg font-bold text-green-600">
                      {claim.additionalExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || '0'), 0).toFixed(2)} €
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} />
              {t('documentsCount', { count: claim.documents.length })}
            </h2>
            {claim.documents.length === 0 ? (
              <p className="text-gray-500">{t('noDocuments')}</p>
            ) : (
              <div className="space-y-2">
                {claim.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">{doc.fileName}</div>
                        <div className="text-xs text-gray-500">
                          {doc.documentType} • {(doc.fileSize / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadDocument(doc.id, doc.fileName)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors"
                    >
                      {t('download')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quickActions')}</h3>
            <div className="space-y-2">
              {claim.status === 'SUBMITTED' && (
                <button
                  onClick={() => updateStatus('IN_REVIEW')}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  <AlertCircle size={16} />
                  {t('putInReview')}
                </button>
              )}
              {(claim.status === 'IN_REVIEW' || claim.status === 'SUBMITTED') && (
                <>
                  <button
                    onClick={() => updateStatus('APPROVED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Check size={16} />
                    {t('approve')}
                  </button>
                  <button
                    onClick={() => updateStatus('REJECTED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                    {t('reject')}
                  </button>
                </>
              )}
              {claim.status === 'APPROVED' && (
                <button
                  onClick={() => updateStatus('PAID')}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Euro size={16} />
                  {t('markPaid')}
                </button>
              )}
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('history')}</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-500">{t('createdOn')}</div>
                <div className="font-medium">
                  {new Date(claim.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              {claim.submittedAt && (
                <div>
                  <div className="text-gray-500">{t('submittedOn')}</div>
                  <div className="font-medium">
                    {new Date(claim.submittedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              )}
              <div>
                <div className="text-gray-500">{t('lastUpdated')}</div>
                <div className="font-medium">
                  {new Date(claim.updatedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Notes internes (TODO) */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              {t('internalNotes')}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{t('featureComingSoon')}</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('addNotePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              rows={4}
              disabled
            />
            <button
              disabled
              className="mt-2 w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
            >
              {t('addNote')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
