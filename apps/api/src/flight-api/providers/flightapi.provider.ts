import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import {
  FlightDataProvider,
  FlightData,
  Airport,
  Airline,
  FlightDataError,
  FlightDataErrorCode,
} from '../interfaces/provider.interface';

interface FlightAPIAirlineResponse {
  departure?: {
    offGroundTime: string;
    outGateTime: string | null;
    gate: string | null;
    departureDateTime: string;
    airport: string;
    airportCity: string;
    airportCode: string;
    airportCountryCode: string;
    scheduledTime: string;
    estimatedTime: string | null;
    terminal: string;
  };
  arrival?: {
    timeRemaining: string | null;
    onGroundTime: string | null;
    inGateTime: string;
    gate: string | null;
    baggage: string | null;
    arrivalDateTime: string;
    airport: string;
    airportCity: string;
    airportCode: string;
    airportCountryCode: string;
    scheduledTime: string;
    estimatedTime: string | null;
    terminal: string;
  };
  aircraft?: {
    id: number;
    code: string;
    name: string;
  };
  status?: string;
}

interface FlightAPIRouteResponse {
  flights: Array<{
    airline: string;
    airlineCode: string;
    flightNumber: number;
    status: number;
    displayStatus: string;
    operatedBy: string | null;
    scheduledTime: string;
    departureTime: string;
    arrivalTime: string;
    timeRemaining: string | null;
  }>;
}

@Injectable()
export class FlightAPIProvider implements FlightDataProvider {
  private readonly logger = new Logger(FlightAPIProvider.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('FLIGHTAPI_KEY', '');
    this.baseUrl = this.configService.get<string>(
      'FLIGHTAPI_BASE_URL',
      'https://api.flightapi.io',
    );
  }

  async searchFlight(
    flightNumber: string,
    date: string,
  ): Promise<FlightData | null> {
    try {
      // Extract airline code and flight number
      const match = flightNumber.match(/^([A-Z]{2,3})(\d+)$/i);
      if (!match) {
        this.logger.warn(`Invalid flight number format: ${flightNumber}`);
        return null;
      }

      const [, airlineCode, flightNum] = match;

      // Format date from YYYY-MM-DD to YYYYMMDD
      const formattedDate = date.replace(/-/g, '');

      this.logger.log(`Searching flight ${flightNumber} on ${date}`);

      const url = `${this.baseUrl}/airline/${this.apiKey}`;
      const response = await firstValueFrom(
        this.httpService.get<FlightAPIAirlineResponse[]>(url, {
          params: {
            num: flightNum,
            name: airlineCode.toUpperCase(),
            date: formattedDate,
          },
          timeout: 15000, // 15 seconds timeout
        }),
      );

      if (!response.data || response.data.length === 0) {
        this.logger.warn(`No data found for flight ${flightNumber} on ${date}`);
        return null;
      }

      return this.transformFlightData(response.data, flightNumber, date);
    } catch (error) {
      this.handleError(error as AxiosError, 'searchFlight');
      return null;
    }
  }

  async searchFlightsByRoute(
    departureAirport: string,
    arrivalAirport: string,
    date: string,
  ): Promise<FlightData[]> {
    try {
      // Format date from YYYY-MM-DD to YYYYMMDD
      const formattedDate = date.replace(/-/g, '');

      this.logger.log(
        `Searching flights from ${departureAirport} to ${arrivalAirport} on ${date}`,
      );

      const url = `${this.baseUrl}/trackbyroute/${this.apiKey}`;
      const response = await firstValueFrom(
        this.httpService.get<FlightAPIRouteResponse>(url, {
          params: {
            date: formattedDate,
            airport1: departureAirport.toUpperCase(),
            airport2: arrivalAirport.toUpperCase(),
          },
        }),
      );

      if (
        !response.data ||
        !response.data.flights ||
        response.data.flights.length === 0
      ) {
        this.logger.warn(
          `No flights found from ${departureAirport} to ${arrivalAirport} on ${date}`,
        );
        return [];
      }

      // Get detailed data for each flight
      const flightDetails = await Promise.all(
        response.data.flights
          .filter((f) => !f.operatedBy) // Only get actual flights, not codeshares
          .slice(0, 10) // Limit to first 10 flights to avoid too many requests
          .map(async (flight) => {
            const flightNumber = `${flight.airlineCode}${flight.flightNumber}`;
            const details = await this.searchFlight(flightNumber, date);
            return details;
          }),
      );

      return flightDetails.filter((f): f is FlightData => f !== null);
    } catch (error) {
      this.handleError(error as AxiosError, 'searchFlightsByRoute');
      return [];
    }
  }

  async searchAirports(_query: string): Promise<Airport[]> {
    // FlightAPI.io doesn't have a direct airport search endpoint
    // You could implement a static list or use another service
    this.logger.warn('Airport search not implemented for FlightAPI.io');
    return [];
  }

  async searchAirlines(_query: string): Promise<Airline[]> {
    // FlightAPI.io doesn't have a direct airline search endpoint
    // You could implement a static list or use another service
    this.logger.warn('Airline search not implemented for FlightAPI.io');
    return [];
  }

  async validateFlightNumber(flightNumber: string): Promise<boolean> {
    const flightNumberRegex = /^[A-Z]{2,3}\d{1,4}[A-Z]?$/i;
    return flightNumberRegex.test(flightNumber);
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.warn('FlightAPI.io API key not configured');
      return false;
    }

    try {
      // Test with a simple request
      const url = `${this.baseUrl}/airline/${this.apiKey}`;
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            num: '1',
            name: 'AF',
            date: today,
          },
          timeout: 10000, // 10 seconds timeout for availability check
        }),
      );

      return response.status === 200;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        this.logger.error('FlightAPI.io API key is invalid');
      }
      this.logger.warn('FlightAPI.io is not available');
      return false;
    }
  }

  private transformFlightData(
    data: FlightAPIAirlineResponse[],
    flightNumber: string,
    date: string,
  ): FlightData | null {
    // Find departure and arrival objects
    const departure = data.find((item) => item.departure)?.departure;
    const arrival = data.find((item) => item.arrival)?.arrival;
    const aircraft = data.find((item) => item.aircraft)?.aircraft;
    const statusItem = data.find((item) => item.status);

    if (!departure || !arrival) {
      this.logger.warn('Incomplete flight data');
      return null;
    }

    // Calculate delays
    const departureDelay = this.calculateDelay(
      departure.scheduledTime,
      departure.offGroundTime || departure.estimatedTime,
    );
    const arrivalDelay = this.calculateDelay(
      arrival.scheduledTime,
      arrival.inGateTime || arrival.estimatedTime,
    );

    // Map status
    const status = this.mapFlightStatus(statusItem?.status || 'Unknown');

    // Extract airline info from flight number
    const airlineCode = flightNumber.match(/^([A-Z]{2,3})/i)?.[1] || '';

    return {
      flightNumber,
      date,
      airline: {
        iata: airlineCode,
        icao: '', // FlightAPI.io doesn't provide ICAO in this endpoint
        name: '', // Would need separate lookup
      },
      departure: {
        airport: {
          iata: departure.airportCode,
          icao: '', // Not provided
          name: departure.airport,
          city: departure.airportCity,
          country: departure.airportCountryCode,
          latitude: 0, // Not provided
          longitude: 0, // Not provided
        },
        time: {
          scheduled: this.parseDateTime(departure.scheduledTime, date),
          estimated: departure.estimatedTime
            ? this.parseDateTime(departure.estimatedTime, date)
            : undefined,
          actual: this.parseDateTime(departure.offGroundTime, date),
          terminal: departure.terminal,
          gate: departure.gate || undefined,
        },
      },
      arrival: {
        airport: {
          iata: arrival.airportCode,
          icao: '', // Not provided
          name: arrival.airport,
          city: arrival.airportCity,
          country: arrival.airportCountryCode,
          latitude: 0, // Not provided
          longitude: 0, // Not provided
        },
        time: {
          scheduled: this.parseDateTime(arrival.scheduledTime, date),
          estimated: arrival.estimatedTime
            ? this.parseDateTime(arrival.estimatedTime, date)
            : undefined,
          actual: arrival.inGateTime
            ? this.parseDateTime(arrival.inGateTime, date)
            : undefined,
          terminal: arrival.terminal,
          gate: arrival.gate || undefined,
          baggage: arrival.baggage || undefined,
        },
      },
      status,
      delay: {
        departure: departureDelay,
        arrival: arrivalDelay,
      },
      distance: undefined, // Not provided by FlightAPI.io
      aircraft: aircraft
        ? {
            model: aircraft.name,
            registration: undefined, // Not provided
            type: aircraft.code,
          }
        : undefined,
    };
  }

  private parseDateTime(timeStr: string, date: string): Date | undefined {
    if (!timeStr) return undefined;

    // timeStr format: "14:09, Aug 27" or ISO string
    // Extract time
    const timeMatch = timeStr.match(/^(\d{2}):(\d{2})/);
    if (!timeMatch) return undefined;

    const [, hours, minutes] = timeMatch;
    const dateObj = new Date(date);
    dateObj.setHours(parseInt(hours, 10));
    dateObj.setMinutes(parseInt(minutes, 10));

    return dateObj;
  }

  private calculateDelay(scheduled: string, actual: string): number | undefined {
    if (!scheduled || !actual) return undefined;

    const scheduledMatch = scheduled.match(/^(\d{2}):(\d{2})/);
    const actualMatch = actual.match(/^(\d{2}):(\d{2})/);

    if (!scheduledMatch || !actualMatch) return undefined;

    const scheduledMinutes =
      parseInt(scheduledMatch[1], 10) * 60 + parseInt(scheduledMatch[2], 10);
    const actualMinutes =
      parseInt(actualMatch[1], 10) * 60 + parseInt(actualMatch[2], 10);

    const delay = actualMinutes - scheduledMinutes;

    // Handle day crossover (if actual is less than scheduled, assume next day)
    if (delay < -12 * 60) {
      return delay + 24 * 60;
    }

    return Math.max(0, delay);
  }

  private mapFlightStatus(status: string): FlightData['status'] {
    const statusLower = status.toLowerCase();

    if (statusLower.includes('arrived') || statusLower.includes('landed')) {
      return 'arrived';
    }
    if (
      statusLower.includes('departed') ||
      statusLower.includes('in air') ||
      statusLower.includes('active')
    ) {
      return 'departed';
    }
    if (
      statusLower.includes('cancelled') ||
      statusLower.includes('canceled')
    ) {
      return 'cancelled';
    }
    if (statusLower.includes('delayed')) {
      return 'delayed';
    }
    if (statusLower.includes('scheduled')) {
      return 'scheduled';
    }

    return 'unknown';
  }

  private handleError(error: AxiosError, operation: string): void {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      this.logger.error(`FlightAPI.io ${operation} failed:`, {
        status,
        message: data?.message || error.message,
      });

      if (
        status === 401 ||
        (data?.message && data.message.includes('key is invalid'))
      ) {
        throw new FlightDataError(
          'Invalid API key',
          FlightDataErrorCode.PROVIDER_UNAVAILABLE,
          'FlightAPI.io',
        );
      }

      if (status === 429) {
        throw new FlightDataError(
          'Rate limit exceeded',
          FlightDataErrorCode.RATE_LIMIT_EXCEEDED,
          'FlightAPI.io',
        );
      }

      if (status === 400 && data?.message) {
        this.logger.warn(`FlightAPI.io: ${data.message}`);
        // Don't throw for 400 errors - just return null from searchFlight
        return;
      }
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new FlightDataError(
        'Network timeout',
        FlightDataErrorCode.NETWORK_ERROR,
        'FlightAPI.io',
      );
    } else {
      this.logger.error(
        `FlightAPI.io ${operation} failed with unknown error:`,
        error.message,
      );
    }
  }
}
