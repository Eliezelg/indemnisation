/**
 * Common interfaces for flight data providers
 */

export enum FlightDataErrorCode {
  PROVIDER_UNAVAILABLE = 'PROVIDER_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  NETWORK_ERROR = 'NETWORK_ERROR',
  FLIGHT_NOT_FOUND = 'FLIGHT_NOT_FOUND',
}

export class FlightDataError extends Error {
  constructor(
    message: string,
    public readonly code: FlightDataErrorCode,
    public readonly provider: string,
  ) {
    super(message);
    this.name = 'FlightDataError';
  }
}

export interface Airport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Airline {
  iata: string;
  icao: string;
  name: string;
}

export interface FlightTime {
  scheduled: Date | undefined;
  estimated?: Date | undefined;
  actual?: Date | undefined;
  terminal?: string;
  gate?: string;
  baggage?: string;
}

export interface FlightArrivalDeparture {
  airport: Airport;
  time: FlightTime;
}

export interface Aircraft {
  model: string;
  registration?: string;
  type?: string;
}

export interface FlightDelay {
  departure?: number; // minutes
  arrival?: number; // minutes
}

export type FlightStatus =
  | 'scheduled'
  | 'departed'
  | 'arrived'
  | 'cancelled'
  | 'delayed'
  | 'diverted'
  | 'unknown';

export interface FlightData {
  flightNumber: string;
  date: string;
  airline: Airline;
  departure: FlightArrivalDeparture;
  arrival: FlightArrivalDeparture;
  status: FlightStatus;
  delay: FlightDelay;
  distance?: number; // in km
  aircraft?: Aircraft;
}

/**
 * Interface that all flight data providers must implement
 */
export interface FlightDataProvider {
  /**
   * Search for a specific flight by flight number and date
   */
  searchFlight(flightNumber: string, date: string): Promise<FlightData | null>;

  /**
   * Search for flights by route and date
   */
  searchFlightsByRoute(
    departureAirport: string,
    arrivalAirport: string,
    date: string,
  ): Promise<FlightData[]>;

  /**
   * Search for airports
   */
  searchAirports(query: string): Promise<Airport[]>;

  /**
   * Search for airlines
   */
  searchAirlines(query: string): Promise<Airline[]>;

  /**
   * Validate flight number format
   */
  validateFlightNumber(flightNumber: string): Promise<boolean>;

  /**
   * Check if the provider is available
   */
  isAvailable(): Promise<boolean>;
}
