import { Injectable } from '@nestjs/common';
import { DisruptionType } from '@prisma/client';

/**
 * EU Regulation 261/2004 Calculator
 *
 * Compensation amounts based on distance and delay:
 * - Short distance (<1500km): €250
 * - Medium distance (1500-3500km): €400
 * - Long distance (>3500km): €600
 *
 * Reductions:
 * - If delay < 3h for long distance: 50% reduction
 * - If delay < 2h for short/medium: 50% reduction
 */
@Injectable()
export class EUCalculatorService {
  /**
   * Calculate compensation according to EU261
   * @param distance - Distance in kilometers
   * @param disruptionType - Type of disruption
   * @param delayMinutes - Delay in minutes (optional)
   * @returns Compensation amount in EUR
   */
  calculate(
    distance: number,
    disruptionType: DisruptionType,
    delayMinutes?: number,
  ): number {
    // No compensation for delays < 3 hours
    if (disruptionType === 'DELAY' && (!delayMinutes || delayMinutes < 180)) {
      return 0;
    }

    // Base compensation based on distance
    let compensation = 0;

    if (distance < 1500) {
      // Short distance: €250
      compensation = 250;
    } else if (distance >= 1500 && distance <= 3500) {
      // Medium distance: €400
      compensation = 400;
    } else {
      // Long distance (>3500km): €600
      compensation = 600;
    }

    // Apply reductions for delays
    if (disruptionType === 'DELAY' && delayMinutes) {
      // Long distance: reduce by 50% if delay < 4 hours
      if (distance > 3500 && delayMinutes < 240) {
        compensation = compensation * 0.5;
      }
      // Short distance: reduce by 50% if delay < 3 hours
      else if (distance < 1500 && delayMinutes < 180) {
        compensation = compensation * 0.5;
      }
      // Medium distance: reduce by 50% if delay < 3 hours
      else if (distance >= 1500 && distance <= 3500 && delayMinutes < 180) {
        compensation = compensation * 0.5;
      }
    }

    // For cancellations and denied boarding, full compensation applies
    return Math.round(compensation);
  }

  /**
   * Check if flight is eligible for EU261 compensation
   * @param departureCountry - ISO country code of departure airport
   * @param arrivalCountry - ISO country code of arrival airport
   * @param airlineCountry - ISO country code of airline (optional)
   * @returns True if eligible
   */
  isEligible(
    departureCountry: string,
    arrivalCountry: string,
    airlineCountry?: string,
  ): boolean {
    const euCountries = [
      'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'GR', 'SE',
      'DK', 'FI', 'IE', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK',
      'SI', 'LT', 'LV', 'EE', 'CY', 'MT', 'LU',
      'NO', 'IS', 'LI', 'CH', // EEA countries
    ];

    // Flight departs from EU
    if (euCountries.includes(departureCountry)) {
      return true;
    }

    // Flight arrives in EU with EU airline
    if (euCountries.includes(arrivalCountry) && airlineCountry && euCountries.includes(airlineCountry)) {
      return true;
    }

    return false;
  }
}
