import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import DocumentUploader from '@/components/documents/DocumentUploader';
import DocumentsList from '@/components/documents/DocumentsList';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

async function DocumentsPageContent({ claimId }: { claimId: string }) {
  const t = await getTranslations('documents');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('uploadDocuments')}</h1>
          <p className="mt-2 text-gray-600">{t('documentsDescription')}</p>
        </div>

        {/* Uploaded Documents */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('uploadedDocuments')}
          </h2>
          <DocumentsList claimId={claimId} />
        </div>

        {/* Upload Sections */}
        <div className="space-y-6">
          {/* Boarding Pass */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('boardingPass')}
                <span className="ml-2 text-sm text-red-600">({t('required')})</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t('boardingPassDescription')}
              </p>
            </div>
            <DocumentUploader
              claimId={claimId}
              documentType="BOARDING_PASS"
            />
          </div>

          {/* Booking Confirmation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('bookingConfirmation')}
                <span className="ml-2 text-sm text-gray-600">({t('optional')})</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t('bookingConfirmationDescription')}
              </p>
            </div>
            <DocumentUploader
              claimId={claimId}
              documentType="BOOKING_CONFIRMATION"
            />
          </div>

          {/* ID Document */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('idDocument')}
                <span className="ml-2 text-sm text-gray-600">({t('optional')})</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t('idDocumentDescription')}
              </p>
            </div>
            <DocumentUploader
              claimId={claimId}
              documentType="ID_DOCUMENT"
            />
          </div>

          {/* Proof of Delay */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('proofOfDelay')}
                <span className="ml-2 text-sm text-gray-600">({t('optional')})</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t('proofOfDelayDescription')}
              </p>
            </div>
            <DocumentUploader
              claimId={claimId}
              documentType="PROOF_OF_DELAY"
            />
          </div>

          {/* Other Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {t('other')}
                <span className="ml-2 text-sm text-gray-600">({t('optional')})</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t('otherDocumentDescription')}
              </p>
            </div>
            <DocumentUploader
              claimId={claimId}
              documentType="OTHER"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DocumentsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentsPageContent claimId={id} />
    </Suspense>
  );
}
