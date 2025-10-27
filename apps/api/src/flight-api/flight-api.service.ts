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
   * Note: FlightAPI.io works best for current/recent flights (today ± 1-2 days)
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
    const airlineCode = flightNumber.match(/^[A-Z]{2,3}/)?.[0] || '';

    // Extract flight number digits (e.g., "869" from "AF869")
    const flightNum = flightNumber.replace(/^[A-Z]+/, '');

    // FlightAPI.io Flight Tracking API endpoint
    const url = `${this.flightApiBaseUrl}/airline/${this.flightApiKey}?num=${flightNum}&name=${airlineCode}&date=${formattedDate}`;

    console.log(`FlightAPI.io: Searching ${flightNumber} for ${formattedDate}`);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.log(`FlightAPI.io: HTTP ${response.status}`);

        // Try to get error message
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          console.log(`FlightAPI.io error: ${errorData.message}`);
        }

        return null;
      }

      const data = await response.json();

      // Check if it's an error response
      if (data.success === false) {
        console.log(`FlightAPI.io: ${data.message || 'Flight not found'}`);
        return null;
      }

      if (!data || !Array.isArray(data) || data.length < 2) {
        console.log('FlightAPI.io: Invalid data structure');
        return null;
      }

      // FlightAPI.io returns an array with departure and arrival objects
      const departure = data[0]?.departure;
      const arrival = data[1]?.arrival;
      const aircraft = data[2]?.aircraft;
      const status = data[3]?.status;

      if (!departure || !arrival) {
        console.log('FlightAPI.io: Missing departure or arrival data');
        return null;
      }

      console.log('FlightAPI.io: Flight found!', {
        from: departure.airportCode,
        to: arrival.airportCode,
        status: status
      });

      // Calculate delay if we have actual times
      let delayMinutes: number | undefined;
      if (arrival.onGroundTime && arrival.scheduledTime) {
        delayMinutes = this.calculateDelay(arrival.scheduledTime, arrival.onGroundTime);
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
        status: status || '',
        actualDepartureTime: departure.offGroundTime || departure.outGateTime,
        actualArrivalTime: arrival.onGroundTime || arrival.inGateTime,
        delayMinutes,
      };
    } catch (error) {
      console.error('FlightAPI.io error:', error.message);
      return null;
    }
  }

  /**
   * Search using FlightLabs API
   * Uses the historical flights endpoint for past flights with flight_num filter
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

    // Extract airline code and flight number
    const airlineCode = flightNumber.match(/^[A-Z]{2,3}/)?.[0] || '';
    const flightNum = flightNumber.replace(/^[A-Z]{2,3}/, '');

    // Map airlines to their hub airports (most likely departure airports)
    const airlineHubs: Record<string, string[]> = {
      'AF': ['CDG', 'ORY'], // Air France: Paris CDG, Orly
      'LY': ['TLV'], // El Al: Tel Aviv
      'BA': ['LHR', 'LGW'], // British Airways: Heathrow, Gatwick
      'LH': ['FRA', 'MUC'], // Lufthansa: Frankfurt, Munich
      'EZY': ['ORY', 'CDG', 'LGW'], // easyJet: Paris, London
      'FR': ['BVA', 'DUB'], // Ryanair: Paris Beauvais, Dublin
      'AA': ['JFK', 'LAX', 'DFW'], // American Airlines
      'DL': ['JFK', 'LAX', 'ATL'], // Delta Air Lines
      'KL': ['AMS'], // KLM: Amsterdam
      'IB': ['MAD'], // Iberia: Madrid
      'AZ': ['FCO'], // ITA Airways: Rome
      'TK': ['IST'], // Turkish Airlines: Istanbul
      'EK': ['DXB'], // Emirates: Dubai
      'QR': ['DOH'], // Qatar Airways: Doha
    };

    // Get likely airports for this airline
    const likelyAirports = airlineHubs[airlineCode] || ['CDG', 'TLV', 'LHR'];

    for (const airportCode of likelyAirports) {
      // Use historical endpoint with flight_num and airline_iata filters
      // This is much more efficient than downloading all flights
      const url = `https://goflightlabs.com/historical?access_key=${this.flightLabsKey}&code=${airportCode}&type=departure&date=${formattedDate}&airline_iata=${airlineCode}&flight_num=${flightNum}`;

      console.log(`FlightLabs Historical: Searching ${flightNumber} from ${airportCode}`);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 429) {
            console.log('FlightLabs: Rate limit reached');
            throw new Error('Rate limit reached');
          }
          console.log(`FlightLabs: ${response.status} for ${airportCode}`);
          continue;
        }

        const result = await response.json();

        // Check if trial limit exceeded or no success
        if (!result || result.success === false) {
          if (result.message?.includes('trial') || result.message?.includes('exceeded')) {
            console.log('FlightLabs: Trial limit exceeded, using mock data');
            throw new Error('Trial limit exceeded');
          }
          console.log(`FlightLabs: No success for ${flightNumber} from ${airportCode}`);
          continue;
        }

        if (!result.data || result.data.length === 0) {
          console.log(`FlightLabs: No data for ${flightNumber} from ${airportCode}`);
          continue;
        }

        // The historical API returns a different structure than advanced-flights-schedules
        // It has a "movement" object

        // IMPORTANT: Filter client-side to ensure we have the right flight
        // The API sometimes returns other flights despite the filters
        const flight = result.data.find(f => {
          const responseFlightNum = f.number?.replace(/\s+/g, '').toUpperCase(); // "AF 869" -> "AF869"
          const searchFlightNum = flightNumber.replace(/\s+/g, '').toUpperCase(); // "AF869" -> "AF869"

          // Check if the flight numbers match
          if (responseFlightNum === searchFlightNum) {
            return true;
          }

          // Also check if airline code matches and the number part matches
          if (f.airline?.iata === airlineCode) {
            const numPart = f.number?.match(/\d+/)?.[0]; // Extract "869" from "AF 869"
            if (numPart === flightNum) {
              return true;
            }
          }

          return false;
        });

        if (!flight) {
          console.log(`FlightLabs: No matching flight found for ${flightNumber} in results`);
          continue;
        }

        console.log('FlightLabs: Flight found!', JSON.stringify(flight, null, 2));

        // Parse the response based on the historical API structure
        // The movement contains departure info, we need to find arrival info
        const flightNumberFromResponse = flight.number?.replace(/\s+/g, '') || flightNumber;
        const airlineInfo = flight.airline || {};

        // Calculate delay from scheduled vs actual times
        let delayMinutes = 0;
        if (flight.delayed) {
          delayMinutes = flight.delayed;
        } else if (flight.movement?.scheduledTime?.utc && flight.movement?.revisedTime?.utc) {
          // Calculate delay from scheduled vs revised time
          const scheduled = new Date(flight.movement.scheduledTime.utc);
          const revised = new Date(flight.movement.revisedTime.utc);
          delayMinutes = Math.floor((revised.getTime() - scheduled.getTime()) / 60000);
        } else if (flight.movement?.scheduledTime?.utc && flight.movement?.runwayTime?.utc) {
          // Calculate delay from scheduled vs actual runway time
          const scheduled = new Date(flight.movement.scheduledTime.utc);
          const runway = new Date(flight.movement.runwayTime.utc);
          delayMinutes = Math.floor((runway.getTime() - scheduled.getTime()) / 60000);
        }

        // For FlightLabs historical API:
        // - We searched by departure airport (airportCode)
        // - The movement.airport is the ARRIVAL airport
        // - movement.scheduledTime is the ARRIVAL time at destination
        const arrivalAirport = flight.movement?.airport?.iata || flight.movement?.airport?.code || '';
        const arrivalTime = flight.movement?.scheduledTime?.utc;
        const arrivalTimeLocal = flight.movement?.scheduledTime?.local;
        const actualArrivalTime = flight.movement?.revisedTime?.utc || flight.movement?.runwayTime?.utc;

        return {
          flightNumber: flightNumberFromResponse,
          airline: airlineInfo.name || '',
          airlineCode: airlineInfo.iata || airlineCode,
          departureAirport: airportCode,
          arrivalAirport: arrivalAirport,
          departureTime: arrivalTimeLocal || arrivalTime, // Use local time if available
          arrivalTime: arrivalTimeLocal || arrivalTime,
          flightDate: formattedDate,
          status: flight.status || 'completed',
          actualDepartureTime: actualArrivalTime, // Use revised/runway time as actual
          actualArrivalTime: actualArrivalTime,
          delayMinutes: delayMinutes > 0 ? delayMinutes : 0,
        };
      } catch (error) {
        console.error(`FlightLabs error for ${airportCode}:`, error.message);
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
