'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  status: string;
  uploadedAt: string;
  claim: {
    id: string;
    claimNumber: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export default function AdminDocumentsPage() {
  const t = useTranslations('admin');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/documents/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      alert('Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/documents/${documentId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Erreur lors du téléchargement');
    }
  };

  const handleValidate = async (documentId: string, status: 'VALIDATED' | 'REJECTED', rejectionReason?: string) => {
    let reason = rejectionReason;
    if (status === 'REJECTED' && !reason) {
      const promptResult = prompt('Raison du rejet:');
      if (!promptResult) return;
      reason = promptResult;
    }

    if (!confirm(`Êtes-vous sûr de vouloir ${status === 'VALIDATED' ? 'valider' : 'rejeter'} ce document?`)) {
      return;
    }

    setValidating(documentId);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/documents/${documentId}/validate`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status, rejectionReason: reason }),
        }
      );

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      // Refresh list
      await fetchPendingDocuments();
      alert(`Document ${status === 'VALIDATED' ? 'validé' : 'rejeté'} avec succès`);
    } catch (error) {
      console.error('Validation error:', error);
      alert('Erreur lors de la validation');
    } finally {
      setValidating(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getDocumentTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      BOARDING_PASS: { label: 'Carte d\'embarquement', color: 'bg-blue-100 text-blue-800' },
      BOOKING_CONFIRMATION: { label: 'Confirmation', color: 'bg-purple-100 text-purple-800' },
      ID_DOCUMENT: { label: 'Pièce d\'identité', color: 'bg-green-100 text-green-800' },
      PROOF_OF_DELAY: { label: 'Preuve de retard', color: 'bg-orange-100 text-orange-800' },
      OTHER: { label: 'Autre', color: 'bg-gray-100 text-gray-800' },
    };

    const typeInfo = types[type] || types.OTHER;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
        {typeInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Validation des Documents</h1>
        <p className="mt-2 text-gray-600">
          {documents.length} document{documents.length !== 1 ? 's' : ''} en attente de validation
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document en attente</h3>
          <p className="mt-1 text-sm text-gray-500">Tous les documents ont été traités.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc.id} className="hover:bg-gray-50">
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <svg
                          className="h-10 w-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.fileName}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getDocumentTypeBadge(doc.documentType)}
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{formatFileSize(doc.fileSize)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Réclamation:</span> {doc.claim.claimNumber}
                        </p>
                        <p>
                          <span className="font-medium">Client:</span>{' '}
                          {doc.claim.user.firstName} {doc.claim.user.lastName} ({doc.claim.user.email})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Téléversé le {new Date(doc.uploadedAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleDownload(doc.id, doc.fileName)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Télécharger
                      </button>
                      <button
                        onClick={() => handleValidate(doc.id, 'VALIDATED')}
                        disabled={validating === doc.id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Valider
                      </button>
                      <button
                        onClick={() => handleValidate(doc.id, 'REJECTED')}
                        disabled={validating === doc.id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
