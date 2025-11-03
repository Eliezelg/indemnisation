/**
 * Currency formatting utilities
 * Handles Euro (€) and Israeli Shekel (₪) based on jurisdiction
 */

export type Jurisdiction = 'EU' | 'ISRAEL' | 'BOTH' | null;
export type Locale = 'fr' | 'he' | 'en' | 'es';

/**
 * Get currency symbol based on jurisdiction and locale
 */
export function getCurrencySymbol(jurisdiction: Jurisdiction, locale?: Locale): string {
  // For Hebrew locale or Israel jurisdiction, use Shekel
  if (locale === 'he' || jurisdiction === 'ISRAEL') {
    return '₪';
  }

  // Default to Euro
  return '€';
}

/**
 * Format amount with appropriate currency symbol
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  jurisdiction: Jurisdiction = null,
  locale?: Locale
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (numAmount === null || numAmount === undefined || isNaN(numAmount)) {
    return '0.00';
  }

  const formatted = numAmount.toFixed(2);
  const symbol = getCurrencySymbol(jurisdiction, locale);

  // For Hebrew, put currency symbol after the amount
  if (locale === 'he') {
    return `${formatted} ${symbol}`;
  }

  // For other locales, put symbol after with space
  return `${formatted} ${symbol}`;
}

/**
 * Get the appropriate amount based on jurisdiction
 */
export function getJurisdictionAmount(
  euAmount: number | string | null | undefined,
  ilAmount: number | string | null | undefined,
  jurisdiction: Jurisdiction,
  locale?: Locale
): string {
  const numEuAmount = typeof euAmount === 'string' ? parseFloat(euAmount) : euAmount;
  const numIlAmount = typeof ilAmount === 'string' ? parseFloat(ilAmount) : ilAmount;

  // For Hebrew locale or Israel jurisdiction, prefer Israeli amount
  if (locale === 'he' || jurisdiction === 'ISRAEL') {
    return formatCurrency(numIlAmount || numEuAmount, 'ISRAEL', locale);
  }

  // For BOTH jurisdiction, show the recommended (higher) amount
  if (jurisdiction === 'BOTH') {
    // Simple comparison - in reality you'd want to convert to same currency
    const euVal = numEuAmount || 0;
    const ilVal = (numIlAmount || 0) / 4.5; // Rough conversion for comparison

    if (ilVal > euVal) {
      return formatCurrency(numIlAmount, 'ISRAEL', locale);
    }
  }

  // Default to EU amount
  return formatCurrency(numEuAmount, 'EU', locale);
}
