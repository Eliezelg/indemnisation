'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  recommendedAmount: number;
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

const statusLabels: Record<string, string> = {
  DRAFT: 'Brouillon',
  SUBMITTED: 'Soumis',
  IN_REVIEW: 'En révision',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  PAID: 'Payé',
};

export default function AdminClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id, locale } = params;

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
        throw new Error('Erreur lors du téléchargement');
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
      alert(err.message || 'Erreur lors du téléchargement');
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
      console.error('Erreur lors du chargement de la réclamation:', error);
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
        alert(`Statut changé vers: ${statusLabels[newStatus]}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Réclamation introuvable</h3>
        <div className="mt-6">
          <Link
            href={`/${locale}/admin/claims`}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Retour à la liste
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
          <p className="text-gray-600 mt-1">Détails de la réclamation</p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[claim.status]
          }`}
        >
          {statusLabels[claim.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du vol */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plane size={20} />
              Informations du vol
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Numéro de vol</div>
                <div className="font-medium font-mono">{claim.flightNumber}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Compagnie aérienne</div>
                <div className="font-medium">{claim.airline}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date du vol</div>
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
                <div className="text-sm text-gray-500">Type de perturbation</div>
                <div className="font-medium">{claim.disruptionType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Aéroport de départ</div>
                <div className="font-medium flex items-center gap-2">
                  <MapPin size={16} />
                  {claim.departureAirport}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Aéroport d&apos;arrivée</div>
                <div className="font-medium flex items-center gap-2">
                  <MapPin size={16} />
                  {claim.arrivalAirport}
                </div>
              </div>
              {claim.delayDuration && (
                <div>
                  <div className="text-sm text-gray-500">Durée du retard</div>
                  <div className="font-medium flex items-center gap-2">
                    <Clock size={16} />
                    {claim.delayDuration} minutes
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-500">Montant recommandé</div>
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
              Informations du passager
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Nom complet</div>
                <div className="font-medium">
                  {claim.user.firstName} {claim.user.lastName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{claim.user.email}</div>
              </div>
              {claim.user.phone && (
                <div>
                  <div className="text-sm text-gray-500">Téléphone</div>
                  <div className="font-medium">{claim.user.phone}</div>
                </div>
              )}
              {claim.user.birthDate && (
                <div>
                  <div className="text-sm text-gray-500">Date de naissance</div>
                  <div className="font-medium">
                    {new Date(claim.user.birthDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              )}
              {claim.user.nationality && (
                <div>
                  <div className="text-sm text-gray-500">Nationalité</div>
                  <div className="font-medium">{claim.user.nationality}</div>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} />
              Documents ({claim.documents.length})
            </h2>
            {claim.documents.length === 0 ? (
              <p className="text-gray-500">Aucun document téléchargé</p>
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
                      Télécharger
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              {claim.status === 'SUBMITTED' && (
                <button
                  onClick={() => updateStatus('IN_REVIEW')}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  <AlertCircle size={16} />
                  Mettre en révision
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
                    Approuver
                  </button>
                  <button
                    onClick={() => updateStatus('REJECTED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                    Rejeter
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
                  Marquer comme payé
                </button>
              )}
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-500">Créée le</div>
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
                  <div className="text-gray-500">Soumise le</div>
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
                <div className="text-gray-500">Dernière mise à jour</div>
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
              Notes internes
            </h3>
            <p className="text-sm text-gray-500 mb-3">Fonctionnalité à venir</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ajouter une note interne..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              rows={4}
              disabled
            />
            <button
              disabled
              className="mt-2 w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
            >
              Ajouter une note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
