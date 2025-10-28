import { Injectable, Logger } from '@nestjs/common';
import { FlightData } from './interfaces/flight.interface';
import { FlightAPIProvider } from './providers/flightapi.provider';
import { MockFlightProvider } from './providers/mock.provider';
import { FlightCacheService } from './cache/flight-cache.service';

/**
 * Main flight API service that coordinates multiple providers
 * Uses FlightAPI.io as primary source, falls back to mock data
 * Implements caching to reduce API calls
 */
@Injectable()
export class FlightApiNewService {
  private readonly logger = new Logger(FlightApiNewService.name);

  constructor(
    private readonly flightApiProvider: FlightAPIProvider,
    private readonly mockProvider: MockFlightProvider,
    private readonly cacheService: FlightCacheService,
  ) {}

  /**
   * Search for flight information by flight number and date
   * Tries cache first, then FlightAPI.io - returns null if not found
   * User will enter flight information manually if null
   */
  async searchFlight(
    flightNumber: string,
    date: string,
  ): Promise<FlightData | null> {
    // 1. Check cache first
    const cached = this.cacheService.get(flightNumber, date);
    if (cached !== undefined) {
      return cached; // Return cached result (can be FlightData or null)
    }

    try {
      // 2. Try FlightAPI.io
      this.logger.log(`Searching flight ${flightNumber} on ${date} (no cache)`);

      const flightApiResult = await this.flightApiProvider.searchFlight(
        flightNumber,
        date,
      );

      if (flightApiResult) {
        this.logger.log(`Flight found via FlightAPI.io`);
        const result = this.transformToLegacyFormat(flightApiResult);

        // Cache the successful result
        this.cacheService.set(flightNumber, date, result);
        return result;
      }
    } catch (error) {
      this.logger.error('FlightAPI.io error:', error.message);
    }

    // No data found - cache the negative result and user will enter manually
    this.logger.log(`No flight data found for ${flightNumber} on ${date}`);
    this.cacheService.setNotFound(flightNumber, date);
    return null;
  }

  /**
   * Transform new FlightData format to legacy format for backward compatibility
   */
  private transformToLegacyFormat(
    data: import('./interfaces/provider.interface').FlightData,
  ): FlightData {
    // Calculate delay in minutes if we have actual arrival time
    let delayMinutes: number | undefined;
    if (data.arrival.time.scheduled && data.arrival.time.actual) {
      const scheduled = new Date(data.arrival.time.scheduled);
      const actual = new Date(data.arrival.time.actual);
      const diffMs = actual.getTime() - scheduled.getTime();
      delayMinutes = Math.max(0, Math.floor(diffMs / 60000));
    } else if (data.delay.arrival) {
      delayMinutes = data.delay.arrival;
    }

    return {
      flightNumber: data.flightNumber,
      airline: data.airline.name,
      airlineCode: data.airline.iata,
      departureAirport: data.departure.airport.iata,
      arrivalAirport: data.arrival.airport.iata,
      departureTime: data.departure.time.scheduled?.toISOString(),
      arrivalTime: data.arrival.time.scheduled?.toISOString(),
      flightDate: data.date,
      status: data.status,
      actualDepartureTime: data.departure.time.actual?.toISOString(),
      actualArrivalTime: data.arrival.time.actual?.toISOString(),
      delayMinutes,
    };
  }

  /**
   * Calculate delay in minutes
   */
  calculateDelay(
    scheduledTime: string,
    actualTime: string,
  ): number | undefined {
    if (!scheduledTime || !actualTime) {
      return undefined;
    }

    const scheduled = new Date(scheduledTime);
    const actual = new Date(actualTime);

    const diffMs = actual.getTime() - scheduled.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    return diffMinutes > 0 ? diffMinutes : 0;
  }

  /**
   * Get airline logo URL
   */
  getAirlineLogo(airlineCode: string): string {
    if (!airlineCode) {
      return '';
    }
    // Using FlightAPI.io airline logos
    return `https://images.flightapi.io/airlines/${airlineCode.toUpperCase()}.png`;
  }
}
