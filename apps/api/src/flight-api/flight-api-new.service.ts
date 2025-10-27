import { Injectable, Logger } from '@nestjs/common';
import { FlightData } from './interfaces/flight.interface';
import { FlightAPIProvider } from './providers/flightapi.provider';
import { MockFlightProvider } from './providers/mock.provider';

/**
 * Main flight API service that coordinates multiple providers
 * Uses FlightAPI.io as primary source, falls back to mock data
 */
@Injectable()
export class FlightApiNewService {
  private readonly logger = new Logger(FlightApiNewService.name);

  constructor(
    private readonly flightApiProvider: FlightAPIProvider,
    private readonly mockProvider: MockFlightProvider,
  ) {}

  /**
   * Search for flight information by flight number and date
   * Tries FlightAPI.io first, then falls back to mock data
   */
  async searchFlight(
    flightNumber: string,
    date: string,
  ): Promise<FlightData | null> {
    try {
      // Try FlightAPI.io first
      this.logger.log(`Searching flight ${flightNumber} on ${date}`);

      const flightApiResult = await this.flightApiProvider.searchFlight(
        flightNumber,
        date,
      );

      if (flightApiResult) {
        this.logger.log(`Flight found via FlightAPI.io`);
        return this.transformToLegacyFormat(flightApiResult);
      }
    } catch (error) {
      this.logger.error('FlightAPI.io error:', error.message);
    }

    // Fallback to mock data
    this.logger.log('Using mock flight data for development');
    const mockResult = await this.mockProvider.searchFlight(flightNumber, date);

    if (mockResult) {
      return this.transformToLegacyFormat(mockResult);
    }

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
