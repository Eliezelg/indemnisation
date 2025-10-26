import { Injectable } from '@nestjs/common';
import { Jurisdiction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EUCalculatorService } from './eu-calculator.service';
import { IsraelCalculatorService } from './israel-calculator.service';

/**
 * Service to determine which jurisdiction(s) apply to a flight
 */
@Injectable()
export class JurisdictionService {
  constructor(
    private prisma: PrismaService,
    private euCalculator: EUCalculatorService,
    private israelCalculator: IsraelCalculatorService,
  ) {}

  /**
   * Determine applicable jurisdiction for a flight
   * @param departureIata - IATA code of departure airport
   * @param arrivalIata - IATA code of arrival airport
   * @param airlineCode - Airline code (optional)
   * @returns Jurisdiction (EU, ISRAEL, or BOTH)
   */
  async determineJurisdiction(
    departureIata: string,
    arrivalIata: string,
    airlineCode?: string,
  ): Promise<Jurisdiction> {
    // Fetch airports to get country codes
    const [departure, arrival] = await Promise.all([
      this.prisma.airport.findUnique({ where: { iata: departureIata.toUpperCase() } }),
      this.prisma.airport.findUnique({ where: { iata: arrivalIata.toUpperCase() } }),
    ]);

    if (!departure || !arrival) {
      throw new Error('Airport not found');
    }

    const departureCountry = departure.country;
    const arrivalCountry = arrival.country;

    // Check eligibility for both jurisdictions
    const euEligible = this.euCalculator.isEligible(
      departureCountry,
      arrivalCountry,
      airlineCode,
    );

    const israelEligible = this.israelCalculator.isEligible(
      departureCountry,
      arrivalCountry,
    );

    // Determine jurisdiction
    if (euEligible && israelEligible) {
      return 'BOTH';
    } else if (euEligible) {
      return 'EU';
    } else if (israelEligible) {
      return 'ISRAEL';
    }

    // No applicable jurisdiction
    return null;
  }

  /**
   * Get country codes for departure and arrival airports
   * @param departureIata - IATA code of departure airport
   * @param arrivalIata - IATA code of arrival airport
   * @returns Object with departure and arrival country codes
   */
  async getCountryCodes(
    departureIata: string,
    arrivalIata: string,
  ): Promise<{ departure: string; arrival: string }> {
    const [departure, arrival] = await Promise.all([
      this.prisma.airport.findUnique({ where: { iata: departureIata.toUpperCase() } }),
      this.prisma.airport.findUnique({ where: { iata: arrivalIata.toUpperCase() } }),
    ]);

    if (!departure || !arrival) {
      throw new Error('Airport not found');
    }

    return {
      departure: departure.country,
      arrival: arrival.country,
    };
  }
}
