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

    // Fallback to mock data for development/demo purposes
    console.log('Using mock flight data for development');
    return this.getMockFlightData(flightNumber, date);
  }

  /**
   * Get mock flight data for development/testing
   * This simulates realistic flight data for common routes
   */
  private getMockFlightData(
    flightNumber: string,
    date: string,
  ): FlightData | null {
    // Extract airline code
    const airlineCode = flightNumber.match(/^[A-Z]{2}/)?.[0] || '';

    // Mock data for common flights
    const mockFlights: Record<string, Partial<FlightData>> = {
      'AF': {
        airline: 'Air France',
        departureAirport: 'CDG',
        arrivalAirport: 'TLV',
      },
      'LY': {
        airline: 'El Al',
        departureAirport: 'TLV',
        arrivalAirport: 'CDG',
      },
      'BA': {
        airline: 'British Airways',
        departureAirport: 'LHR',
        arrivalAirport: 'CDG',
      },
      'LH': {
        airline: 'Lufthansa',
        departureAirport: 'FRA',
        arrivalAirport: 'TLV',
      },
      'EZY': {
        airline: 'easyJet',
        departureAirport: 'ORY',
        arrivalAirport: 'TLV',
      },
      'FR': {
        airline: 'Ryanair',
        departureAirport: 'BVA',
        arrivalAirport: 'BGY',
      },
    };

    const mockData = mockFlights[airlineCode] || mockFlights[airlineCode.substring(0, 2)];

    if (!mockData) {
      // Default mock data
      return {
        flightNumber,
        airline: 'Demo Airline',
        airlineCode,
        departureAirport: 'CDG',
        arrivalAirport: 'TLV',
        departureTime: `${date}T10:00:00`,
        arrivalTime: `${date}T15:30:00`,
        flightDate: date.split('T')[0],
        status: 'completed',
        actualDepartureTime: `${date}T10:15:00`,
        actualArrivalTime: `${date}T19:45:00`,
        delayMinutes: 255, // 4h15min delay
      };
    }

    // Create realistic mock data with delay
    const departureDate = new Date(date);
    const scheduledDeparture = new Date(departureDate);
    scheduledDeparture.setHours(10, 0, 0);

    const scheduledArrival = new Date(scheduledDeparture);
    scheduledArrival.setHours(scheduledArrival.getHours() + 5, 30, 0);

    // Add random delay between 3-6 hours
    const delayMinutes = 180 + Math.floor(Math.random() * 180);
    const actualArrival = new Date(scheduledArrival);
    actualArrival.setMinutes(actualArrival.getMinutes() + delayMinutes);

    return {
      flightNumber,
      airline: mockData.airline || 'Demo Airline',
      airlineCode,
      departureAirport: mockData.departureAirport || 'CDG',
      arrivalAirport: mockData.arrivalAirport || 'TLV',
      departureTime: scheduledDeparture.toISOString(),
      arrivalTime: scheduledArrival.toISOString(),
      flightDate: date.split('T')[0],
      status: 'completed',
      actualDepartureTime: scheduledDeparture.toISOString(),
      actualArrivalTime: actualArrival.toISOString(),
      delayMinutes,
    };
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
   * Uses the historical flights endpoint for past flights
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

    // Try the historical endpoint first for past flights
    // The historical endpoint requires a time range
    const dateFrom = `${formattedDate}T00:00`;
    const dateTo = `${formattedDate}T23:59`;

    // Extract airline code to guess most likely departure airport
    const airlineCode = flightNumber.match(/^[A-Z]{2,3}/)?.[0] || '';

    // Map airlines to their hub airports to reduce API calls
    const airlineHubs: Record<string, string[]> = {
      'AF': ['CDG', 'ORY'],
      'LY': ['TLV'],
      'BA': ['LHR'],
      'LH': ['FRA'],
      'EZY': ['ORY', 'CDG'],
      'FR': ['BVA'],
      'AA': ['JFK', 'LAX'],
      'DL': ['JFK', 'LAX'],
    };

    // Get likely airports for this airline, fall back to common European airports
    const likelyAirports = airlineHubs[airlineCode] || ['CDG', 'TLV', 'LHR'];

    for (const airportCode of likelyAirports) {
      // Try departure from this airport
      const url = `https://goflightlabs.com/historical?access_key=${this.flightLabsKey}&code=${airportCode}&date_from=${dateFrom}&date_to=${dateTo}&type=departure`;

      console.log(`FlightLabs: Trying ${airportCode} for ${flightNumber}`);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 429) {
            console.log('FlightLabs: Rate limit reached, falling back to mock data');
            throw new Error('Rate limit reached');
          }
          console.log(`FlightLabs: ${airportCode} returned ${response.status}`);
          continue;
        }

        const data = await response.json();

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.log(`FlightLabs: No data for ${airportCode}`);
          continue;
        }

        // Find the flight with matching flight number
        const flight = data.find(f =>
          f.flight_iata === flightNumber ||
          f.flight_number === flightNumber ||
          `${f.airline?.iata}${f.flight_number}` === flightNumber
        );

        if (!flight) {
          console.log(`FlightLabs: ${flightNumber} not in ${airportCode} departures`);
          continue;
        }

        console.log('FlightLabs: Flight found!', flight);

        // Calculate delay if we have actual times
        let delayMinutes = 0;
        if (flight.arrival?.actual && flight.arrival?.scheduled) {
          const actual = new Date(flight.arrival.actual);
          const scheduled = new Date(flight.arrival.scheduled);
          delayMinutes = Math.floor((actual.getTime() - scheduled.getTime()) / 60000);
        }

        return {
          flightNumber: flight.flight_iata || flightNumber,
          airline: flight.airline?.name || '',
          airlineCode: flight.airline?.iata || '',
          departureAirport: flight.departure?.iata || '',
          arrivalAirport: flight.arrival?.iata || '',
          departureTime: flight.departure?.scheduled,
          arrivalTime: flight.arrival?.scheduled,
          flightDate: formattedDate,
          status: flight.status || 'completed',
          actualDepartureTime: flight.departure?.actual,
          actualArrivalTime: flight.arrival?.actual,
          delayMinutes: delayMinutes > 0 ? delayMinutes : 0,
        };
      } catch (error) {
        console.error(`FlightLabs error for ${airportCode}:`, error.message);
        // If we hit rate limit, stop trying other airports
        if (error.message === 'Rate limit reached') {
          throw error;
        }
        continue;
      }
    }

    return null;
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
