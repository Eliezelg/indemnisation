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
   * Tries FlightAPI.io first, then falls back to FlightLabs, then mock data for development
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

    // Format: YYYYMMDD (FlightAPI.io format)
    const formattedDate = date.split('T')[0].replace(/-/g, '');

    // Extract airline code (e.g., "AF" from "AF869")
    const airlineCode = flightNumber.match(/^[A-Z]{2}/)?.[0] || '';

    // Extract flight number digits (e.g., "869" from "AF869")
    const flightNum = flightNumber.replace(/[A-Z]+/, '');

    // FlightAPI.io Flight Tracking API endpoint
    const url = `${this.flightApiBaseUrl}/airline/${this.flightApiKey}?num=${flightNum}&name=${airlineCode}&date=${formattedDate}`;

    console.log('FlightAPI.io URL:', url);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.log(`FlightAPI.io request failed: ${response.status}`);
        throw new Error(`FlightAPI request failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data) || data.length < 2) {
        console.log('FlightAPI.io: No valid data returned');
        return null;
      }

      // FlightAPI.io returns an array with departure and arrival objects
      const departure = data[0]?.departure;
      const arrival = data[1]?.arrival;

      if (!departure || !arrival) {
        console.log('FlightAPI.io: Missing departure or arrival data');
        return null;
      }

      return {
        flightNumber,
        airline: '', // FlightAPI.io doesn't return airline name in this endpoint
        airlineCode,
        departureAirport: departure.airportCode || '',
        arrivalAirport: arrival.airportCode || '',
        departureTime: departure.scheduledTime,
        arrivalTime: arrival.scheduledTime,
        flightDate: date.split('T')[0],
        status: '', // FlightAPI.io doesn't return status in this format
        actualDepartureTime: departure.offGroundTime,
        actualArrivalTime: arrival.onGroundTime,
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

    // Extract airline code (e.g., "AF" from "AF869")
    const airlineCode = flightNumber.match(/^[A-Z]{2}/)?.[0] || '';

    // FlightLabs requires a specific airport code and type (departure/arrival)
    // We'll try departure from common airports
    const commonAirports = ['CDG', 'TLV', 'LHR', 'FRA', 'AMS', 'MAD', 'BCN', 'FCO', 'ORY'];

    for (const airportCode of commonAirports) {
      // Use advanced-flights-schedules endpoint
      const url = `https://www.goflightlabs.com/advanced-flights-schedules?access_key=${this.flightLabsKey}&iataCode=${airportCode}&type=departure&flight_iata=${flightNumber}`;

      console.log('FlightLabs URL:', url);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          console.log(`FlightLabs response not OK for ${airportCode}: ${response.status}`);
          continue; // Try next airport
        }

        const data = await response.json();

        if (!data || !data.success || !data.data || data.data.length === 0) {
          console.log(`No data from FlightLabs for ${airportCode}`);
          continue; // Try next airport
        }

        // Take the first flight
        const flight = data.data[0];

        console.log('FlightLabs flight found:', flight);

        return {
          flightNumber: flight.flight_iata || flightNumber,
          airline: '', // Will be filled from airline name if available
          airlineCode: flight.airline_iata || '',
          departureAirport: flight.dep_iata || '',
          arrivalAirport: flight.arr_iata || '',
          departureTime: flight.dep_time,
          arrivalTime: flight.arr_time,
          flightDate: formattedDate,
          status: flight.status || 'scheduled',
          actualDepartureTime: flight.dep_actual,
          actualArrivalTime: flight.arr_actual,
          delayMinutes: flight.arr_delayed || flight.dep_delayed || 0,
        };
      } catch (error) {
        console.error(`FlightLabs request error for ${airportCode}:`, error);
        continue; // Try next airport
      }
    }

    return null; // No flight found
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
