import { Injectable } from '@nestjs/common';
import { DisruptionType, Jurisdiction } from '@prisma/client';
import { DistanceService } from './distance.service';
import { EUCalculatorService } from './eu-calculator.service';
import { IsraelCalculatorService } from './israel-calculator.service';
import { JurisdictionService } from './jurisdiction.service';

export interface CompensationResult {
  distance: number;
  jurisdiction: Jurisdiction;
  calculatedAmountEU: number | null;
  calculatedAmountIL: number | null;
  recommendedAmount: number;
  currency: string;
  details: {
    euEligible: boolean;
    israelEligible: boolean;
    euAmount?: number;
    ilsAmount?: number;
    reasoning: string;
  };
}

/**
 * Orchestrator service that coordinates all compensation calculations
 */
@Injectable()
export class CompensationService {
  constructor(
    private distanceService: DistanceService,
    private euCalculator: EUCalculatorService,
    private israelCalculator: IsraelCalculatorService,
    private jurisdictionService: JurisdictionService,
  ) {}

  /**
   * Calculate compensation for a flight disruption
   * @param departureIata - IATA code of departure airport
   * @param arrivalIata - IATA code of arrival airport
   * @param disruptionType - Type of disruption
   * @param delayMinutes - Delay in minutes (optional)
   * @param airlineCode - Airline code (optional)
   * @param flightDate - Date of the flight (optional, for war exemption check)
   * @returns Complete compensation calculation result
   */
  async calculateCompensation(
    departureIata: string,
    arrivalIata: string,
    disruptionType: DisruptionType,
    delayMinutes?: number,
    airlineCode?: string,
    flightDate?: Date,
  ): Promise<CompensationResult> {
    // Calculate distance between airports
    const distance = await this.distanceService.calculateDistance(
      departureIata,
      arrivalIata,
    );

    // Determine applicable jurisdiction
    const jurisdiction = await this.jurisdictionService.determineJurisdiction(
      departureIata,
      arrivalIata,
      airlineCode,
    );

    // Get country codes
    const countries = await this.jurisdictionService.getCountryCodes(
      departureIata,
      arrivalIata,
    );

    // Calculate compensation for each applicable jurisdiction
    let calculatedAmountEU: number | null = null;
    let calculatedAmountIL: number | null = null;
    let euEligible = false;
    let israelEligible = false;
    let israelWarExemption = false;

    if (jurisdiction === 'EU' || jurisdiction === 'BOTH') {
      euEligible = true;
      calculatedAmountEU = this.euCalculator.calculate(
        distance,
        disruptionType,
        delayMinutes,
      );
    }

    if (jurisdiction === 'ISRAEL' || jurisdiction === 'BOTH') {
      israelEligible = true;
      const ilResult = this.israelCalculator.calculateBoth(
        distance,
        disruptionType,
        delayMinutes,
        flightDate,
      );
      calculatedAmountIL = ilResult.ils;
      israelWarExemption = ilResult.warExemption || false;
    }

    // Determine recommended amount (highest compensation)
    let recommendedAmount = 0;
    let currency = 'EUR';
    let reasoning = '';

    if (euEligible && israelEligible) {
      // Both jurisdictions apply - recommend the higher one
      const ilsInEur = this.israelCalculator.convertToEUR(calculatedAmountIL);

      if (israelWarExemption && calculatedAmountIL === 0) {
        // Israeli compensation not available due to war exemption
        recommendedAmount = calculatedAmountEU;
        currency = 'EUR';
        reasoning = `BOTH_WAR_EXEMPTION|${calculatedAmountEU}|${calculatedAmountIL}|${ilsInEur}`;
      } else if (calculatedAmountEU >= ilsInEur) {
        recommendedAmount = calculatedAmountEU;
        currency = 'EUR';
        reasoning = `BOTH_EU_BETTER|${calculatedAmountEU}|${calculatedAmountIL}|${ilsInEur}`;
      } else {
        recommendedAmount = calculatedAmountIL;
        currency = 'ILS';
        reasoning = `BOTH_IL_BETTER|${calculatedAmountIL}|${ilsInEur}|${calculatedAmountEU}`;
      }
    } else if (euEligible) {
      recommendedAmount = calculatedAmountEU;
      currency = 'EUR';
      reasoning = `EU_ONLY|${calculatedAmountEU}`;
    } else if (israelEligible) {
      if (israelWarExemption && calculatedAmountIL === 0) {
        reasoning = 'IL_WAR_EXEMPTION';
      } else {
        recommendedAmount = calculatedAmountIL;
        currency = 'ILS';
        const eurEquiv = this.israelCalculator.convertToEUR(calculatedAmountIL);
        reasoning = `IL_ONLY|${calculatedAmountIL}|${eurEquiv}`;
      }
    } else {
      reasoning = 'NO_JURISDICTION';
    }

    return {
      distance,
      jurisdiction,
      calculatedAmountEU,
      calculatedAmountIL,
      recommendedAmount,
      currency,
      details: {
        euEligible,
        israelEligible,
        euAmount: calculatedAmountEU,
        ilsAmount: calculatedAmountIL,
        reasoning,
      },
    };
  }
}
