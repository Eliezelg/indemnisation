import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AirlinesService {
  private readonly logger = new Logger(AirlinesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Search airlines by query (fuzzy search across IATA, ICAO, name)
   */
  async searchAirlines(query: string) {
    const searchTerm = query.trim().toUpperCase();

    try {
      // Search across multiple fields
      const airlines = await this.prisma.airline.findMany({
        where: {
          OR: [
            { iata: { contains: searchTerm, mode: 'insensitive' } },
            { icao: { contains: searchTerm, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: [
          // Prioritize exact IATA matches
          { iata: 'asc' },
          { name: 'asc' },
        ],
        take: 20, // Limit results
      });

      this.logger.log(`Found ${airlines.length} airlines matching "${query}"`);

      return airlines.map((airline) => ({
        code: airline.iata,
        icao: airline.icao,
        name: airline.name,
        country: airline.country,
        alliance: airline.alliance,
      }));
    } catch (error) {
      this.logger.error('Error searching airlines:', error);
      return [];
    }
  }

  /**
   * Get all airlines ordered by name
   */
  async getAllAirlines() {
    try {
      const airlines = await this.prisma.airline.findMany({
        orderBy: [{ name: 'asc' }],
      });

      return airlines.map((airline) => ({
        code: airline.iata,
        icao: airline.icao,
        name: airline.name,
        country: airline.country,
        alliance: airline.alliance,
      }));
    } catch (error) {
      this.logger.error('Error fetching all airlines:', error);
      return [];
    }
  }

  /**
   * Get airline by exact IATA code
   */
  async getAirlineByCode(iataCode: string) {
    try {
      const airline = await this.prisma.airline.findUnique({
        where: { iata: iataCode.toUpperCase() },
      });

      if (!airline) {
        return null;
      }

      return {
        code: airline.iata,
        icao: airline.icao,
        name: airline.name,
        country: airline.country,
        alliance: airline.alliance,
      };
    } catch (error) {
      this.logger.error(`Error fetching airline ${iataCode}:`, error);
      return null;
    }
  }

  /**
   * Get airlines by alliance
   */
  async getAirlinesByAlliance(alliance: string) {
    try {
      const airlines = await this.prisma.airline.findMany({
        where: {
          alliance: {
            equals: alliance,
            mode: 'insensitive',
          },
        },
        orderBy: [{ name: 'asc' }],
      });

      return airlines.map((airline) => ({
        code: airline.iata,
        icao: airline.icao,
        name: airline.name,
        country: airline.country,
        alliance: airline.alliance,
      }));
    } catch (error) {
      this.logger.error(`Error fetching airlines for alliance ${alliance}:`, error);
      return [];
    }
  }

  /**
   * Get airlines statistics
   */
  async getAirlinesStats() {
    try {
      const totalCount = await this.prisma.airline.count();

      const byAlliance = await this.prisma.airline.groupBy({
        by: ['alliance'],
        _count: true,
      });

      const byCountry = await this.prisma.airline.groupBy({
        by: ['country'],
        _count: true,
        orderBy: {
          _count: {
            country: 'desc',
          },
        },
        take: 10, // Top 10 countries
      });

      return {
        total: totalCount,
        byAlliance: byAlliance.map((group) => ({
          alliance: group.alliance || 'Independent',
          count: group._count,
        })),
        topCountries: byCountry.map((group) => ({
          country: group.country,
          count: group._count,
        })),
      };
    } catch (error) {
      this.logger.error('Error fetching airlines stats:', error);
      return {
        total: 0,
        byAlliance: [],
        topCountries: [],
      };
    }
  }
}
