'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

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

export default function NewClaimPage() {
  const router = useRouter();
  const t = useTranslations('claim');
  const tCommon = useTranslations('common');
  const tDetail = useTranslations('claimDetail');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  // Parse and translate reasoning from backend
  const translateReasoning = (reasoning: string): string => {
    if (!reasoning) return '';

    const parts = reasoning.split('|');
    const type = parts[0];

    switch (type) {
      case 'BOTH_EU_BETTER':
        return tDetail('bothEuBetter', {
          euAmount: parts[1],
          ilAmount: parts[2],
          eurEquiv: parts[3]
        });
      case 'BOTH_IL_BETTER':
        return tDetail('bothIlBetter', {
          ilAmount: parts[1],
          eurEquiv: parts[2],
          euAmount: parts[3]
        });
      case 'EU_ONLY':
        return tDetail('euOnly', { amount: parts[1] });
      case 'IL_ONLY':
        return tDetail('ilOnly', {
          amount: parts[1],
          eurEquiv: parts[2]
        });
      case 'NO_JURISDICTION':
        return tDetail('noJurisdiction');
      default:
        return reasoning; // Fallback pour ancien format
    }
  };

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

  const DISRUPTION_TYPES = [
    { value: 'DELAY', label: t('delay'), description: t('delayDescription') },
    { value: 'CANCELLATION', label: t('cancellation'), description: t('cancellationDescription') },
    { value: 'DENIED_BOARDING', label: t('deniedBoarding'), description: t('deniedBoardingDescription') },
  ];

  const handleNext = () => {
    setError('');

    if (step === 1) {
      if (!formData.flightNumber || !formData.flightDate || !formData.departureAirport || !formData.arrivalAirport) {
        setError(t('requiredFieldsError'));
        return;
      }
    }

    if (step === 2) {
      if (!formData.disruptionType) {
        setError(t('selectDisruptionError'));
        return;
      }
      if (formData.disruptionType === 'DELAY' && !formData.delayMinutes) {
        setError(t('delayDurationError'));
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
      setError(t('requiredFieldsError'));
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
        throw new Error(data.message || t('createError'));
      }

      setResult(data);
      setStep(4); // Results step
    } catch (err: any) {
      setError(err.message || tCommon('error'));
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
            {t('appTitle')}
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
            ← {t('backToDashboard')}
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          {step < 4 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{t('stepProgress', { current: step, total: 3 })}</span>
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
                    {t('step1Title')}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('flightNumber')} *
                      </label>
                      <input
                        type="text"
                        name="flightNumber"
                        value={formData.flightNumber}
                        onChange={handleChange}
                        placeholder={t('flightNumberPlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('flightDate')} *
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
                        {t('departureAirport')} *
                      </label>
                      <select
                        name="departureAirport"
                        value={formData.departureAirport}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">{t('selectAirport')}</option>
                        {AIRPORTS.map((airport) => (
                          <option key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name} ({airport.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('arrivalAirport')} *
                      </label>
                      <select
                        name="arrivalAirport"
                        value={formData.arrivalAirport}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">{t('selectAirport')}</option>
                        {AIRPORTS.map((airport) => (
                          <option key={airport.code} value={airport.code}>
                            {airport.code} - {airport.name} ({airport.city})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('airline')}
                      </label>
                      <input
                        type="text"
                        name="airline"
                        value={formData.airline}
                        onChange={handleChange}
                        placeholder={t('airlinePlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                  >
                    {tCommon('next')}
                  </button>
                </div>
              )}

              {/* Step 2: Disruption Details */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('step2Title')}
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
                          {t('delayMinutes')} *
                        </label>
                        <input
                          type="number"
                          name="delayMinutes"
                          value={formData.delayMinutes}
                          onChange={handleChange}
                          min="0"
                          placeholder={t('delayMinutesPlaceholder')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={formData.disruptionType === 'DELAY'}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {t('delayHint')}
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
                      {tCommon('previous')}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                    >
                      {tCommon('next')}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Passenger Information */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('step3Title')}
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('firstName')} *
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
                          {t('lastName')} *
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
                        {t('email')} *
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
                        {t('phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('phonePlaceholder')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('bookingReference')}
                      </label>
                      <input
                        type="text"
                        name="bookingReference"
                        value={formData.bookingReference}
                        onChange={handleChange}
                        placeholder={t('bookingRefPlaceholder')}
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
                      {tCommon('previous')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      {loading ? t('calculating') : t('submit')}
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
                      {t('resultTitle')}
                    </h2>
                    <p className="text-gray-600">
                      {t('resultClaimNumber')}: <span className="font-semibold">{result.claimNumber}</span>
                    </p>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600 mb-1">{t('resultRecommendedAmount')}</p>
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
                        <span className="font-semibold">{t('resultDistance')}:</span> {result.distance} km
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">{t('resultJurisdiction')}:</span> {result.jurisdiction}
                      </p>
                      {result.calculatedAmountEU && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">{t('resultEuAmount')}:</span> €{result.calculatedAmountEU}
                        </p>
                      )}
                      {result.calculatedAmountIL && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">{t('resultIlAmount')}:</span> ₪{result.calculatedAmountIL}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">
                      {translateReasoning(result.compensation.reasoning)}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md text-center transition-colors"
                  >
                    {t('backToDashboard')}
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
