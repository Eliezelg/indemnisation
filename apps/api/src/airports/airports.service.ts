import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AirportsService {
  private readonly logger = new Logger(AirportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Search airports by query (fuzzy search across IATA, name, city, country)
   */
  async searchAirports(query: string) {
    const searchTerm = query.trim().toUpperCase();

    try {
      // Search across multiple fields
      const airports = await this.prisma.airport.findMany({
        where: {
          OR: [
            { iata: { contains: searchTerm, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { country: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: [
          // Prioritize exact IATA matches
          { iata: 'asc' },
          { city: 'asc' },
        ],
        take: 20, // Limit results
      });

      this.logger.log(`Found ${airports.length} airports matching "${query}"`);

      return airports.map((airport) => ({
        code: airport.iata,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        latitude: airport.latitude,
        longitude: airport.longitude,
      }));
    } catch (error) {
      this.logger.error('Error searching airports:', error);
      return [];
    }
  }

  /**
   * Get all airports ordered by city
   */
  async getAllAirports() {
    try {
      const airports = await this.prisma.airport.findMany({
        orderBy: [{ country: 'asc' }, { city: 'asc' }],
      });

      return airports.map((airport) => ({
        code: airport.iata,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        latitude: airport.latitude,
        longitude: airport.longitude,
      }));
    } catch (error) {
      this.logger.error('Error fetching all airports:', error);
      return [];
    }
  }

  /**
   * Get airport by exact IATA code
   */
  async getAirportByCode(iataCode: string) {
    try {
      const airport = await this.prisma.airport.findUnique({
        where: { iata: iataCode.toUpperCase() },
      });

      if (!airport) {
        return null;
      }

      return {
        code: airport.iata,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        latitude: airport.latitude,
        longitude: airport.longitude,
      };
    } catch (error) {
      this.logger.error(`Error fetching airport ${iataCode}:`, error);
      return null;
    }
  }
}
