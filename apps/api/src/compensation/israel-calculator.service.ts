import { Injectable } from '@nestjs/common';
import { DisruptionType } from '@prisma/client';

/**
 * Israeli Aviation Services Law 2012 Calculator
 *
 * Compensation based on delay duration for flights to/from Israel:
 * - Delay 3-4 hours: ₪750 (~€187)
 * - Delay 4-6 hours: ₪1,500 (~€375)
 * - Delay 6-8 hours: ₪2,250 (~€562)
 * - Delay >8 hours: ₪3,000 (~€750)
 *
 * Exchange rate: 1 EUR ≈ 4 ILS (approximate)
 */
@Injectable()
export class IsraelCalculatorService {
  // Exchange rate EUR to ILS (Israeli Shekel)
  private readonly EUR_TO_ILS = 4.0;

  /**
   * Calculate compensation according to Israeli law
   * @param distance - Distance in kilometers (not used in Israeli law)
   * @param disruptionType - Type of disruption
   * @param delayMinutes - Delay in minutes
   * @returns Compensation amount in ILS
   */
  calculate(
    distance: number,
    disruptionType: DisruptionType,
    delayMinutes?: number,
  ): number {
    // Israeli law only applies to delays
    if (disruptionType !== 'DELAY' || !delayMinutes) {
      // For cancellations, treat as 8+ hour delay
      if (disruptionType === 'CANCELLATION') {
        return 3000; // Maximum compensation
      }
      // For denied boarding, treat as 8+ hour delay
      if (disruptionType === 'DENIED_BOARDING') {
        return 3000;
      }
      return 0;
    }

    // No compensation for delays < 3 hours
    if (delayMinutes < 180) {
      return 0;
    }

    // Calculate compensation based on delay duration
    if (delayMinutes >= 180 && delayMinutes < 240) {
      // 3-4 hours: ₪750
      return 750;
    } else if (delayMinutes >= 240 && delayMinutes < 360) {
      // 4-6 hours: ₪1,500
      return 1500;
    } else if (delayMinutes >= 360 && delayMinutes < 480) {
      // 6-8 hours: ₪2,250
      return 2250;
    } else {
      // >8 hours: ₪3,000
      return 3000;
    }
  }

  /**
   * Convert ILS to EUR
   * @param ilsAmount - Amount in ILS
   * @returns Amount in EUR
   */
  convertToEUR(ilsAmount: number): number {
    return Math.round(ilsAmount / this.EUR_TO_ILS);
  }

  /**
   * Check if flight is eligible for Israeli compensation
   * @param departureCountry - ISO country code of departure airport
   * @param arrivalCountry - ISO country code of arrival airport
   * @returns True if eligible
   */
  isEligible(departureCountry: string, arrivalCountry: string): boolean {
    // Israeli law applies to flights departing from or arriving in Israel
    return departureCountry === 'IL' || arrivalCountry === 'IL';
  }

  /**
   * Get compensation in both ILS and EUR
   * @param distance - Distance in kilometers
   * @param disruptionType - Type of disruption
   * @param delayMinutes - Delay in minutes
   * @returns Object with ILS and EUR amounts
   */
  calculateBoth(
    distance: number,
    disruptionType: DisruptionType,
    delayMinutes?: number,
  ): { ils: number; eur: number } {
    const ils = this.calculate(distance, disruptionType, delayMinutes);
    const eur = this.convertToEUR(ils);
    return { ils, eur };
  }
}
