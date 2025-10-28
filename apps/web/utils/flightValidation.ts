/**
 * Validate flight number format (IATA format)
 * Examples: AF123, BA456, LY789, EK1234
 * Format: 2 letters (airline code) + 1-4 digits
 */
export function validateFlightNumber(flightNumber: string): {
  isValid: boolean;
  error?: string;
} {
  if (!flightNumber) {
    return { isValid: false, error: 'Le numéro de vol est requis' };
  }

  // Remove spaces and convert to uppercase
  const cleaned = flightNumber.trim().toUpperCase();

  // IATA flight number format: 2 letters + 1-4 digits
  const iataRegex = /^[A-Z]{2}\d{1,4}$/;

  if (!iataRegex.test(cleaned)) {
    return {
      isValid: false,
      error:
        'Format invalide. Exemple: AF123 (2 lettres + 1-4 chiffres)',
    };
  }

  return { isValid: true };
}

/**
 * Format flight number to standard format (uppercase, no spaces)
 */
export function formatFlightNumber(flightNumber: string): string {
  return flightNumber.trim().toUpperCase().replace(/\s+/g, '');
}

/**
 * Extract airline code from flight number
 * Example: "AF123" -> "AF"
 */
export function getAirlineCode(flightNumber: string): string {
  const cleaned = formatFlightNumber(flightNumber);
  const match = cleaned.match(/^[A-Z]{2}/);
  return match ? match[0] : '';
}

/**
 * Extract flight number digits
 * Example: "AF123" -> "123"
 */
export function getFlightDigits(flightNumber: string): string {
  const cleaned = formatFlightNumber(flightNumber);
  const match = cleaned.match(/\d{1,4}$/);
  return match ? match[0] : '';
}
