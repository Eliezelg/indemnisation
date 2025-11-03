import { Injectable } from '@nestjs/common';
import { DisruptionType } from '@prisma/client';

/**
 * Israeli Aviation Services Law 2012 Calculator (חוק שירותי תעופה)
 *
 * Compensation based on flight distance (similar to EU261/2004):
 * - Up to 2,000 km: ₪1,490 (~€373)
 * - 2,001-4,500 km: ₪2,390 (~€598)
 * - Over 4,500 km: ₪3,580 (~€895)
 *
 * Note: Amounts are indexed annually on January 1st according to CPI
 * Exchange rate: 1 EUR ≈ 4 ILS (approximate)
 *
 * Eligibility:
 * - Applies to cancellations or delays of 8+ hours
 * - Delays 2-8 hours: meals, refreshments, communication services
 * - Delays 5-8 hours: also entitled to refund or alternative flight
 */
@Injectable()
export class IsraelCalculatorService {
  // Exchange rate EUR to ILS (Israeli Shekel)
  private readonly EUR_TO_ILS = 4.0;

  // Compensation amounts according to Israeli law (2025 indexed values)
  private readonly COMPENSATION_SHORT_DISTANCE = 1490; // up to 2,000 km
  private readonly COMPENSATION_MEDIUM_DISTANCE = 2390; // 2,001-4,500 km
  private readonly COMPENSATION_LONG_DISTANCE = 3580; // over 4,500 km

  /**
   * Calculate compensation according to Israeli Aviation Services Law 2012
   * @param distance - Distance in kilometers
   * @param disruptionType - Type of disruption
   * @param delayMinutes - Delay in minutes
   * @returns Compensation amount in ILS
   */
  calculate(
    distance: number,
    disruptionType: DisruptionType,
    delayMinutes?: number,
  ): number {
    // Israeli law applies to cancellations and delays of 8+ hours
    const isEligibleDelay = disruptionType === 'DELAY' && delayMinutes && delayMinutes >= 480;
    const isCancellationOrDeniedBoarding =
      disruptionType === 'CANCELLATION' || disruptionType === 'DENIED_BOARDING';

    if (!isEligibleDelay && !isCancellationOrDeniedBoarding) {
      return 0;
    }

    // Calculate compensation based on distance
    if (distance <= 2000) {
      return this.COMPENSATION_SHORT_DISTANCE;
    } else if (distance <= 4500) {
      return this.COMPENSATION_MEDIUM_DISTANCE;
    } else {
      return this.COMPENSATION_LONG_DISTANCE;
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

  /**
   * Get assistance entitlements based on delay duration
   * @param delayMinutes - Delay in minutes
   * @returns Object describing assistance entitlements
   */
  getAssistanceEntitlements(delayMinutes?: number): {
    meals: boolean;
    refreshments: boolean;
    communication: boolean;
    accommodation: boolean;
    refundOrAlternativeFlight: boolean;
  } {
    if (!delayMinutes) {
      return {
        meals: false,
        refreshments: false,
        communication: false,
        accommodation: false,
        refundOrAlternativeFlight: false,
      };
    }

    // No assistance for delays under 2 hours
    if (delayMinutes < 120) {
      return {
        meals: false,
        refreshments: false,
        communication: false,
        accommodation: false,
        refundOrAlternativeFlight: false,
      };
    }

    // 2-5 hours: meals, refreshments, communication
    if (delayMinutes >= 120 && delayMinutes < 300) {
      return {
        meals: true,
        refreshments: true,
        communication: true,
        accommodation: false,
        refundOrAlternativeFlight: false,
      };
    }

    // 5-8 hours: all above + refund or alternative flight option
    if (delayMinutes >= 300 && delayMinutes < 480) {
      return {
        meals: true,
        refreshments: true,
        communication: true,
        accommodation: false,
        refundOrAlternativeFlight: true,
      };
    }

    // 8+ hours: considered cancellation, full assistance including accommodation
    return {
      meals: true,
      refreshments: true,
      communication: true,
      accommodation: true,
      refundOrAlternativeFlight: true,
    };
  }
}
