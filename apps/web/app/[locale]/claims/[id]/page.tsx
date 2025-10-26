'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  SUBMITTED: { label: 'Soumise', color: 'bg-blue-100 text-blue-700' },
  IN_REVIEW: { label: 'En cours', color: 'bg-yellow-100 text-yellow-700' },
  APPROVED: { label: 'Approuvée', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Rejetée', color: 'bg-red-100 text-red-700' },
  PAID: { label: 'Payée', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Annulée', color: 'bg-gray-100 text-gray-700' },
};

const DISRUPTION_LABELS: Record<string, string> = {
  DELAY: 'Retard',
  CANCELLATION: 'Annulation',
  DENIED_BOARDING: 'Refus d\'embarquement',
};

export default function ClaimDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClaim = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/claims/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Réclamation introuvable');
        }

        const data = await response.json();
        setClaim(data);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue');
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
        throw new Error('Erreur lors de la soumission');
      }

      const data = await response.json();
      setClaim(data);
      alert('Réclamation soumise avec succès!');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Réclamation introuvable'}</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_LABELS[claim.status] || { label: claim.status, color: 'bg-gray-100 text-gray-700' };
  const disruption = DISRUPTION_LABELS[claim.disruptionType] || claim.disruptionType;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            Indemnisation Vols
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
            ← Retour au tableau de bord
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Réclamation {claim.claimNumber}
                </h1>
                <p className="text-gray-600">
                  Vol {claim.flightNumber} • {claim.departureAirport} → {claim.arrivalAirport}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Compensation Amount */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 text-center mb-2">Montant d'indemnisation recommandé</p>
              <p className="text-5xl font-bold text-blue-600 text-center">
                €{claim.recommendedAmount}
              </p>
              {claim.calculatedAmountIL && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  (ou ₪{claim.calculatedAmountIL})
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
                  {submitting ? 'Soumission en cours...' : 'Soumettre la réclamation'}
                </button>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Une fois soumise, vous ne pourrez plus modifier votre réclamation
                </p>
              </div>
            )}
          </div>

          {/* Flight Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Détails du vol</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Numéro de vol</p>
                <p className="font-semibold">{claim.flightNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{new Date(claim.flightDate).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Départ</p>
                <p className="font-semibold">{claim.departureAirport}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Arrivée</p>
                <p className="font-semibold">{claim.arrivalAirport}</p>
              </div>
              {claim.airline && (
                <div>
                  <p className="text-sm text-gray-500">Compagnie</p>
                  <p className="font-semibold">{claim.airline}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Distance</p>
                <p className="font-semibold">{claim.distance} km</p>
              </div>
            </div>
          </div>

          {/* Disruption Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Perturbation</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-semibold">{disruption}</p>
              </div>
              {claim.delayMinutes && (
                <div>
                  <p className="text-sm text-gray-500">Durée du retard</p>
                  <p className="font-semibold">
                    {Math.floor(claim.delayMinutes / 60)}h {claim.delayMinutes % 60}min
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Passenger Info */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations passager</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nom complet</p>
                <p className="font-semibold">
                  {claim.passengerInfo.firstName} {claim.passengerInfo.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{claim.passengerInfo.email}</p>
              </div>
              {claim.passengerInfo.phone && (
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-semibold">{claim.passengerInfo.phone}</p>
                </div>
              )}
              {claim.passengerInfo.bookingReference && (
                <div>
                  <p className="text-sm text-gray-500">Référence de réservation</p>
                  <p className="font-semibold">{claim.passengerInfo.bookingReference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Compensation Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Calcul de l'indemnisation</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Juridiction applicable</p>
                <p className="font-semibold">{claim.jurisdiction}</p>
              </div>
              {claim.calculatedAmountEU && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">Règlement européen CE 261/2004</p>
                  <p className="font-semibold text-lg text-blue-600">€{claim.calculatedAmountEU}</p>
                </div>
              )}
              {claim.calculatedAmountIL && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">Loi israélienne sur les services aériens (2012)</p>
                  <p className="font-semibold text-lg text-blue-600">
                    ₪{claim.calculatedAmountIL} (≈ €{Math.round(Number(claim.calculatedAmountIL) / 4)})
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Historique</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="font-semibold">Réclamation créée</p>
                  <p className="text-sm text-gray-500">
                    {new Date(claim.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
              {claim.submittedAt && (
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-semibold">Réclamation soumise</p>
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
