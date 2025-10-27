import { Injectable, Logger } from '@nestjs/common';
import {
  FlightDataProvider,
  FlightData,
  Airport,
  Airline,
} from '../interfaces/provider.interface';

/**
 * Mock provider for development and testing
 * Always returns realistic flight data
 */
@Injectable()
export class MockFlightProvider implements FlightDataProvider {
  private readonly logger = new Logger(MockFlightProvider.name);

  private readonly mockRoutes: Record<
    string,
    { airline: string; from: string; to: string }
  > = {
    AF: { airline: 'Air France', from: 'CDG', to: 'TLV' },
    LY: { airline: 'El Al', from: 'TLV', to: 'CDG' },
    BA: { airline: 'British Airways', from: 'LHR', to: 'CDG' },
    LH: { airline: 'Lufthansa', from: 'FRA', to: 'TLV' },
    EZY: { airline: 'easyJet', from: 'ORY', to: 'TLV' },
    FR: { airline: 'Ryanair', from: 'BVA', to: 'BGY' },
    AA: { airline: 'American Airlines', from: 'JFK', to: 'LAX' },
    DL: { airline: 'Delta Air Lines', from: 'JFK', to: 'CDG' },
  };

  async searchFlight(
    flightNumber: string,
    date: string,
  ): Promise<FlightData | null> {
    this.logger.log(`Mock: Generating data for ${flightNumber} on ${date}`);

    const airlineCode = flightNumber.match(/^([A-Z]{2,3})/i)?.[1] || 'XX';
    const route =
      this.mockRoutes[airlineCode.toUpperCase()] ||
      this.mockRoutes['AF'];

    // Create realistic mock data with delay
    const departureDate = new Date(date);
    const scheduledDeparture = new Date(departureDate);
    scheduledDeparture.setHours(10, 0, 0, 0);

    const scheduledArrival = new Date(scheduledDeparture);
    scheduledArrival.setHours(scheduledArrival.getHours() + 5, 30, 0, 0);

    // Random delay between 3-6 hours (180-360 minutes)
    const delayMinutes = 180 + Math.floor(Math.random() * 180);
    const actualArrival = new Date(scheduledArrival);
    actualArrival.setMinutes(actualArrival.getMinutes() + delayMinutes);

    return {
      flightNumber,
      date,
      airline: {
        iata: airlineCode.toUpperCase(),
        icao: airlineCode.toUpperCase() + 'X',
        name: route.airline,
      },
      departure: {
        airport: {
          iata: route.from,
          icao: route.from + 'X',
          name: `${route.from} Airport`,
          city: route.from,
          country: 'FR',
          latitude: 0,
          longitude: 0,
        },
        time: {
          scheduled: scheduledDeparture,
          estimated: scheduledDeparture,
          actual: scheduledDeparture,
          terminal: '2G',
          gate: 'G21',
        },
      },
      arrival: {
        airport: {
          iata: route.to,
          icao: route.to + 'X',
          name: `${route.to} Airport`,
          city: route.to,
          country: 'IL',
          latitude: 0,
          longitude: 0,
        },
        time: {
          scheduled: scheduledArrival,
          estimated: actualArrival,
          actual: actualArrival,
          terminal: '3',
        },
      },
      status: 'arrived',
      delay: {
        departure: 0,
        arrival: delayMinutes,
      },
      distance: 3300, // km (approximate CDG-TLV distance)
    };
  }

  async searchFlightsByRoute(
    _departureAirport: string,
    _arrivalAirport: string,
    _date: string,
  ): Promise<FlightData[]> {
    this.logger.warn('Mock: searchFlightsByRoute not implemented');
    return [];
  }

  async searchAirports(_query: string): Promise<Airport[]> {
    this.logger.warn('Mock: searchAirports not implemented');
    return [];
  }

  async searchAirlines(_query: string): Promise<Airline[]> {
    this.logger.warn('Mock: searchAirlines not implemented');
    return [];
  }

  async validateFlightNumber(flightNumber: string): Promise<boolean> {
    const flightNumberRegex = /^[A-Z]{2,3}\d{1,4}[A-Z]?$/i;
    return flightNumberRegex.test(flightNumber);
  }

  async isAvailable(): Promise<boolean> {
    return true; // Mock provider is always available
  }
}
