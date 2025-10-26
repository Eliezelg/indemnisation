'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AIRPORTS = [
  { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'ORY', name: 'Paris Orly', city: 'Paris', country: 'France' },
  { code: 'LYS', name: 'Lyon-Saint Exupéry', city: 'Lyon', country: 'France' },
  { code: 'MRS', name: 'Marseille Provence', city: 'Marseille', country: 'France' },
  { code: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'France' },
  { code: 'TLS', name: 'Toulouse-Blagnac', city: 'Toulouse', country: 'France' },
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'Israel' },
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'United Kingdom' },
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'Germany' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'MAD', name: 'Madrid-Barajas', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Barcelona-El Prat', city: 'Barcelona', country: 'Spain' },
  { code: 'FCO', name: 'Rome Fiumicino', city: 'Rome', country: 'Italy' },
  { code: 'VIE', name: 'Vienna', city: 'Vienna', country: 'Austria' },
  { code: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
];

const DISRUPTION_TYPES = [
  { value: 'DELAY', label: 'Retard', description: 'Vol retardé de plus de 3 heures' },
  { value: 'CANCELLATION', label: 'Annulation', description: 'Vol annulé par la compagnie' },
  { value: 'DENIED_BOARDING', label: 'Refus d\'embarquement', description: 'Surbooking ou autre raison' },
];

export default function NewClaimPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    // Step 1: Flight info
    flightNumber: '',
    flightDate: '',
    departureAirport: '',
    arrivalAirport: '',
    airline: '',

    // Step 2: Disruption
    disruptionType: '',
    delayMinutes: '',

    // Step 3: Passenger
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bookingReference: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setError('');

    if (step === 1) {
      if (!formData.flightNumber || !formData.flightDate || !formData.departureAirport || !formData.arrivalAirport) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }

    if (step === 2) {
      if (!formData.disruptionType) {
        setError('Veuillez sélectionner le type de perturbation');
        return;
      }
      if (formData.disruptionType === 'DELAY' && !formData.delayMinutes) {
        setError('Veuillez indiquer la durée du retard');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');

      const payload = {
        flightNumber: formData.flightNumber,
        flightDate: formData.flightDate,
        departureAirport: formData.departureAirport,
        arrivalAirport: formData.arrivalAirport,
        airline: formData.airline || undefined,
        disruptionType: formData.disruptionType,
        delayMinutes: formData.delayMinutes ? parseInt(formData.delayMinutes) : undefined,
        passengerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          bookingReference: formData.bookingReference || undefined,
        },
      };

      const response = await fetch('http://localhost:3001/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la réclamation');
      }

      setResult(data);
      setStep(4); // Results step
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          {step < 4 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Étape {step} sur 3</span>
                <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Flight Information */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Informations du vol
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de vol *
                      </label>
                      <input
                        type="text"
                        name="flightNumber"
                        value={formData.flightNumber}
                        onChange={handleChange}
                        placeholder="Ex: AF1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date du vol *
                      </label>
                      <input
                        type="date"
                        name="flightDate"
                        value={formData.flightDate}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aéroport de départ *
                      </label>
                      <select
                        name="departureAirport"
                        value={formData.departureAirport}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Sélectionnez un aéroport</option>
                        {AIRPORTS.map((airport) => (
                          <option key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name} ({airport.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aéroport d'arrivée *
                      </label>
                      <select
                        name="arrivalAirport"
                        value={formData.arrivalAirport}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Sélectionnez un aéroport</option>
                        {AIRPORTS.map((airport) => (
                          <option key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name} ({airport.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Compagnie aérienne (optionnel)
                      </label>
                      <input
                        type="text"
                        name="airline"
                        value={formData.airline}
                        onChange={handleChange}
                        placeholder="Ex: Air France, EL AL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                  >
                    Continuer
                  </button>
                </div>
              )}

              {/* Step 2: Disruption Details */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Type de perturbation
                  </h2>

                  <div className="space-y-4">
                    {DISRUPTION_TYPES.map((type) => (
                      <label
                        key={type.value}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.disruptionType === type.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="disruptionType"
                          value={type.value}
                          checked={formData.disruptionType === type.value}
                          onChange={handleChange}
                          className="mr-3"
                        />
                        <span className="font-semibold">{type.label}</span>
                        <p className="text-sm text-gray-600 ml-6">{type.description}</p>
                      </label>
                    ))}

                    {formData.disruptionType === 'DELAY' && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Durée du retard (en minutes) *
                        </label>
                        <input
                          type="number"
                          name="delayMinutes"
                          value={formData.delayMinutes}
                          onChange={handleChange}
                          min="0"
                          placeholder="Ex: 240"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={formData.disruptionType === 'DELAY'}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Ex: 4 heures = 240 minutes
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-md transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Passenger Information */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Informations du passager
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone (optionnel)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Référence de réservation (optionnel)
                      </label>
                      <input
                        type="text"
                        name="bookingReference"
                        value={formData.bookingReference}
                        onChange={handleChange}
                        placeholder="Ex: ABC123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-md transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Calcul en cours...' : 'Calculer mon indemnisation'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Results */}
              {step === 4 && result && (
                <div>
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Réclamation créée !
                    </h2>
                    <p className="text-gray-600">
                      Numéro de réclamation: <span className="font-semibold">{result.claimNumber}</span>
                    </p>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600 mb-1">Montant d'indemnisation recommandé</p>
                      <p className="text-5xl font-bold text-blue-600">
                        {result.currency === 'EUR' ? '€' : '₪'}{result.recommendedAmount}
                      </p>
                      {result.currency === 'ILS' && (
                        <p className="text-sm text-gray-600 mt-1">
                          (≈ €{Math.round(result.recommendedAmount / 4)})
                        </p>
                      )}
                    </div>

                    <div className="border-t border-blue-200 pt-4 mt-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Distance:</span> {result.distance} km
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Juridiction:</span> {result.jurisdiction}
                      </p>
                      {result.calculatedAmountEU && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Règlement EU:</span> €{result.calculatedAmountEU}
                        </p>
                      )}
                      {result.calculatedAmountIL && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Loi israélienne:</span> ₪{result.calculatedAmountIL}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">
                      {result.compensation.reasoning}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md text-center transition-colors"
                  >
                    Retour au tableau de bord
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
