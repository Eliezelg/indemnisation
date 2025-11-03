'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import FileUpload from '@/components/FileUpload';
import DocumentList from '@/components/DocumentList';
import { DocumentType } from '@/types/document';
import AirportAutocomplete from '@/components/AirportAutocomplete';
import AirlineAutocomplete from '@/components/AirlineAutocomplete';
import { validateFlightNumber, formatFlightNumber } from '@/utils/flightValidation';

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
  const tDocs = useTranslations('documents');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [searchingFlight, setSearchingFlight] = useState(false);
  const [flightFound, setFlightFound] = useState(false);
  const [airlineLogo, setAirlineLogo] = useState('');
  const [flightNumberError, setFlightNumberError] = useState('');

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

    // Step 4: Company contact and expenses
    hasContactedCompany: 'false',
    companyContactDetails: '',
    additionalExpenses: [] as Array<{
      type: string;
      amount: string;
      description: string;
    }>,
  });

  const searchFlightInfo = async (flightNumber: string, date: string) => {
    if (!flightNumber || !date) return;

    setSearchingFlight(true);
    setFlightFound(false);
    setError('');

    try {
      const response = await fetch(
        `https://indem.webpro200.com/api/flight-api/search?flightNumber=${encodeURIComponent(flightNumber)}&date=${encodeURIComponent(date)}`
      );

      if (!response.ok) {
        throw new Error('Failed to search flight');
      }

      const data = await response.json();

      if (data.found && data.data) {
        console.log('Flight API response:', data.data);

        // Auto-populate fields
        const updatedData: any = {};

        if (data.data.departureAirport) {
          updatedData.departureAirport = data.data.departureAirport;
        }

        if (data.data.arrivalAirport) {
          updatedData.arrivalAirport = data.data.arrivalAirport;
        }

        if (data.data.airline) {
          updatedData.airline = data.data.airline;
        }

        if (data.data.delayMinutes) {
          updatedData.delayMinutes = data.data.delayMinutes.toString();
        }

        console.log('Updating form with:', updatedData);

        setFormData(prev => ({
          ...prev,
          ...updatedData,
        }));

        setAirlineLogo(data.data.airlineLogo || '');
        setFlightFound(true);

        // Auto-detect disruption type based on delay
        if (data.data.delayMinutes && data.data.delayMinutes >= 180) {
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              disruptionType: 'DELAY',
            }));
          }, 100);
        }
      }
    } catch (err) {
      console.error('Flight search error:', err);
    } finally {
      setSearchingFlight(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validate and format flight number
    if (name === 'flightNumber') {
      const formatted = formatFlightNumber(value);
      const validation = validateFlightNumber(formatted);

      if (value && !validation.isValid) {
        setFlightNumberError(validation.error || '');
      } else {
        setFlightNumberError('');
      }

      setFormData(prev => ({
        ...prev,
        [name]: formatted,
      }));

      // Trigger flight search when both flightNumber and date are filled
      if (formatted && formData.flightDate && validation.isValid) {
        searchFlightInfo(formatted, formData.flightDate);
      }

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Trigger flight search when both flightNumber and date are filled
    if (name === 'flightDate') {
      const newFormData = { ...formData, [name]: value };
      if (newFormData.flightNumber && value) {
        const validation = validateFlightNumber(newFormData.flightNumber);
        if (validation.isValid) {
          searchFlightInfo(newFormData.flightNumber, value);
        }
      }
    }
  };

  // Handler for airport autocomplete changes
  const handleAirportChange = (field: 'departureAirport' | 'arrivalAirport', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
        hasContactedCompany: formData.hasContactedCompany === 'true',
        companyContactDetails: formData.hasContactedCompany === 'true' ? formData.companyContactDetails : undefined,
        additionalExpenses: formData.additionalExpenses.length > 0 ? formData.additionalExpenses : undefined,
        passengerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          bookingReference: formData.bookingReference || undefined,
        },
      };

      const response = await fetch('https://indem.webpro200.com/api/claims', {
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
      setStep(5); // Documents upload step
    } catch (err: any) {
      setError(err.message || tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSkipDocuments = () => {
    setStep(6); // Skip to results
  };

  const handleContinueToResults = () => {
    setStep(6); // Go to results after uploading documents
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
          {step < 5 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{t('stepProgress', { current: step, total: 4 })}</span>
                <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          flightNumberError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {flightNumberError && (
                        <p className="mt-1 text-sm text-red-500">{flightNumberError}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Format: AF123 (2 lettres + 1-4 chiffres)</p>
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

                    {/* Flight Search Status */}
                    {(searchingFlight || flightFound) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        {searchingFlight && (
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-blue-800">{t('searchingFlight')}</span>
                          </div>
                        )}
                        {flightFound && !searchingFlight && (
                          <div className="flex items-center gap-3">
                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-green-800">{t('flightFound')}</span>
                            {airlineLogo && (
                              <img
                                src={airlineLogo}
                                alt="Airline logo"
                                className="h-8 ml-auto"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <AirportAutocomplete
                      value={formData.departureAirport}
                      onChange={(value) => handleAirportChange('departureAirport', value)}
                      label={t('departureAirport')}
                      placeholder="Rechercher par code, ville ou pays..."
                      required
                    />

                    <AirportAutocomplete
                      value={formData.arrivalAirport}
                      onChange={(value) => handleAirportChange('arrivalAirport', value)}
                      label={t('arrivalAirport')}
                      placeholder="Rechercher par code, ville ou pays..."
                      required
                    />

                    <AirlineAutocomplete
                      value={formData.airline}
                      onChange={(value) => setFormData(prev => ({ ...prev, airline: value }))}
                      label={t('airline')}
                      placeholder="Rechercher par code ou nom..."
                    />
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
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                    >
                      {tCommon('next')}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Company Contact and Additional Expenses */}
              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('step4Title')}
                  </h2>

                  <div className="space-y-6">
                    {/* Company Contact Question */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="block text-md font-semibold text-gray-900 mb-3">
                        {t('hasContactedCompany')} *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="hasContactedCompany"
                            value="true"
                            checked={formData.hasContactedCompany === 'true'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span>{tCommon('yes')}</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="hasContactedCompany"
                            value="false"
                            checked={formData.hasContactedCompany === 'false'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span>{tCommon('no')}</span>
                        </label>
                      </div>

                      {formData.hasContactedCompany === 'true' && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('companyContactDetails')}
                          </label>
                          <textarea
                            name="companyContactDetails"
                            value={formData.companyContactDetails}
                            onChange={(e) => setFormData(prev => ({ ...prev, companyContactDetails: e.target.value }))}
                            rows={4}
                            placeholder={t('companyContactPlaceholder')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {t('companyContactNote')}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Additional Expenses */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3">
                        {t('additionalExpenses')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {t('additionalExpensesDescription')}
                      </p>

                      {formData.additionalExpenses.map((expense, index) => (
                        <div key={index} className="mb-4 p-3 bg-gray-50 rounded-md">
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {t('expenseType')}
                              </label>
                              <select
                                value={expense.type}
                                onChange={(e) => {
                                  const newExpenses = [...formData.additionalExpenses];
                                  newExpenses[index].type = e.target.value;
                                  setFormData(prev => ({ ...prev, additionalExpenses: newExpenses }));
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">{t('selectType')}</option>
                                <option value="TICKET">{t('newTicket')}</option>
                                <option value="TAXI">{t('taxi')}</option>
                                <option value="HOTEL">{t('hotel')}</option>
                                <option value="FOOD">{t('food')}</option>
                                <option value="OTHER">{t('otherExpense')}</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                {t('amount')} (€)
                              </label>
                              <input
                                type="number"
                                value={expense.amount}
                                onChange={(e) => {
                                  const newExpenses = [...formData.additionalExpenses];
                                  newExpenses[index].amount = e.target.value;
                                  setFormData(prev => ({ ...prev, additionalExpenses: newExpenses }));
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              {t('description')}
                            </label>
                            <input
                              type="text"
                              value={expense.description}
                              onChange={(e) => {
                                const newExpenses = [...formData.additionalExpenses];
                                newExpenses[index].description = e.target.value;
                                setFormData(prev => ({ ...prev, additionalExpenses: newExpenses }));
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={t('expenseDescriptionPlaceholder')}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newExpenses = formData.additionalExpenses.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, additionalExpenses: newExpenses }));
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-700"
                          >
                            {t('removeExpense')}
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            additionalExpenses: [
                              ...prev.additionalExpenses,
                              { type: '', amount: '', description: '' }
                            ]
                          }));
                        }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        + {t('addExpense')}
                      </button>
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

              {/* Step 5: Upload Documents */}
              {step === 5 && result && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {tDocs('uploadDocuments')}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {t('documentsDescription')}
                  </p>

                  {uploadSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800">{uploadSuccess}</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Uploaded Documents */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {tDocs('uploadedDocuments')}
                    </h3>
                    <DocumentList
                      claimId={result.id}
                      onDocumentsChange={() => {
                        setUploadSuccess('');
                        setError('');
                      }}
                    />
                  </div>

                  {/* Upload New Documents */}
                  <div className="space-y-6">
                    {/* Boarding Pass */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">
                        {tDocs('boardingPass')} <span className="text-red-500">*</span>
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{t('boardingPassDescription')}</p>
                      <FileUpload
                        claimId={result.id}
                        documentType={DocumentType.BOARDING_PASS}
                        onUploadSuccess={() => {
                          setUploadSuccess(tDocs('uploadSuccess'));
                          setError('');
                          // Trigger DocumentList refresh by changing key
                        }}
                        onUploadError={(err) => {
                          setError(err);
                          setUploadSuccess('');
                        }}
                      />
                    </div>

                    {/* Booking Confirmation */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">
                        {tDocs('bookingConfirmation')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{t('bookingConfirmationDescription')}</p>
                      <FileUpload
                        claimId={result.id}
                        documentType={DocumentType.BOOKING_CONFIRMATION}
                        onUploadSuccess={() => {
                          setUploadSuccess(tDocs('uploadSuccess'));
                          setError('');
                        }}
                        onUploadError={(err) => {
                          setError(err);
                          setUploadSuccess('');
                        }}
                      />
                    </div>

                    {/* ID Document */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">
                        {tDocs('idDocument')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{t('idDocumentDescription')}</p>
                      <FileUpload
                        claimId={result.id}
                        documentType={DocumentType.ID_DOCUMENT}
                        onUploadSuccess={() => {
                          setUploadSuccess(tDocs('uploadSuccess'));
                          setError('');
                        }}
                        onUploadError={(err) => {
                          setError(err);
                          setUploadSuccess('');
                        }}
                      />
                    </div>

                    {/* Proof of Delay */}
                    {formData.disruptionType === 'DELAY' && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-md font-semibold text-gray-900 mb-2">
                          {tDocs('proofOfDelay')}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{t('proofOfDelayDescription')}</p>
                        <FileUpload
                          claimId={result.id}
                          documentType={DocumentType.PROOF_OF_DELAY}
                          onUploadSuccess={() => {
                            setUploadSuccess(tDocs('uploadSuccess'));
                            setError('');
                          }}
                          onUploadError={(err) => {
                            setError(err);
                            setUploadSuccess('');
                          }}
                        />
                      </div>
                    )}

                    {/* Other Documents */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">
                        {tDocs('other')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{t('otherDocumentDescription')}</p>
                      <FileUpload
                        claimId={result.id}
                        documentType={DocumentType.OTHER}
                        onUploadSuccess={() => {
                          setUploadSuccess(tDocs('uploadSuccess'));
                          setError('');
                        }}
                        onUploadError={(err) => {
                          setError(err);
                          setUploadSuccess('');
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      type="button"
                      onClick={handleSkipDocuments}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-md transition-colors"
                    >
                      {t('skipDocuments')}
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueToResults}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                    >
                      {tCommon('next')}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Results */}
              {step === 6 && result && (
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
