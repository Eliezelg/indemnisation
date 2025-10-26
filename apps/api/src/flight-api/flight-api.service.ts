import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlightData } from './interfaces/flight.interface';

@Injectable()
export class FlightApiService {
  private flightApiKey: string;
  private flightApiBaseUrl: string;
  private flightLabsKey: string;

  constructor(private configService: ConfigService) {
    this.flightApiKey = this.configService.get<string>('FLIGHTAPI_KEY');
    this.flightApiBaseUrl = this.configService.get<string>('FLIGHTAPI_BASE_URL');
    this.flightLabsKey = this.configService.get<string>('FLIGHTLABS_KEY');
  }

  /**
   * Search for flight information by flight number and date
   * Tries FlightAPI.io first, then falls back to FlightLabs
   */
  async searchFlight(
    flightNumber: string,
    date: string,
  ): Promise<FlightData | null> {
    try {
      // Try FlightAPI.io first
      const flightApiResult = await this.searchFlightApi(flightNumber, date);
      if (flightApiResult) {
        return flightApiResult;
      }
    } catch (error) {
      console.error('FlightAPI.io error:', error.message);
    }

    try {
      // Fallback to FlightLabs
      const flightLabsResult = await this.searchFlightLabs(flightNumber, date);
      if (flightLabsResult) {
        return flightLabsResult;
      }
    } catch (error) {
      console.error('FlightLabs error:', error.message);
    }

    return null;
  }

  /**
   * Search using FlightAPI.io
   */
  private async searchFlightApi(
    flightNumber: string,
    date: string,
  ): Promise<FlightData | null> {
    if (!this.flightApiKey || !this.flightApiBaseUrl) {
      throw new Error('FlightAPI credentials not configured');
    }

    // Format: YYYY-MM-DD
    const formattedDate = date.split('T')[0];

    const url = `${this.flightApiBaseUrl}/compschedule/${this.flightApiKey}?mode=arrivals&day=${formattedDate}&flight=${flightNumber}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`FlightAPI request failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
      }

      // Take the first matching flight
      const flight = data[0];

      return {
        flightNumber: flight.flight?.number || flightNumber,
        airline: flight.airline?.name || '',
        airlineCode: flight.airline?.iata || '',
        departureAirport: flight.departure?.iata || '',
        arrivalAirport: flight.arrival?.iata || '',
        departureTime: flight.departure?.scheduledTime,
        arrivalTime: flight.arrival?.scheduledTime,
        flightDate: formattedDate,
        status: flight.status,
        actualDepartureTime: flight.departure?.actualTime,
        actualArrivalTime: flight.arrival?.actualTime,
      };
    } catch (error) {
      console.error('FlightAPI.io request error:', error);
      throw error;
    }
  }

  /**
   * Search using FlightLabs API
   */
  private async searchFlightLabs(
    flightNumber: string,
    date: string,
  ): Promise<FlightData | null> {
    if (!this.flightLabsKey) {
      throw new Error('FlightLabs credentials not configured');
    }

    // Format: YYYY-MM-DD
    const formattedDate = date.split('T')[0];

    const url = `https://app.goflightlabs.com/flights?access_key=${this.flightLabsKey}&flight_iata=${flightNumber}&dep_date=${formattedDate}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`FlightLabs request failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.data || data.data.length === 0) {
        return null;
      }

      // Take the first matching flight
      const flight = data.data[0];

      return {
        flightNumber: flight.flight?.iata || flightNumber,
        airline: flight.airline?.name || '',
        airlineCode: flight.airline?.iata || '',
        departureAirport: flight.departure?.iata || '',
        arrivalAirport: flight.arrival?.iata || '',
        departureTime: flight.departure?.scheduled,
        arrivalTime: flight.arrival?.scheduled,
        flightDate: formattedDate,
        status: flight.flight_status,
        actualDepartureTime: flight.departure?.actual,
        actualArrivalTime: flight.arrival?.actual,
      };
    } catch (error) {
      console.error('FlightLabs request error:', error);
      throw error;
    }
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
