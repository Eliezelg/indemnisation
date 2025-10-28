import { Controller, Get, Query, Logger } from '@nestjs/common';
import { AirlinesService } from './airlines.service';

@Controller('airlines')
export class AirlinesController {
  private readonly logger = new Logger(AirlinesController.name);

  constructor(private readonly airlinesService: AirlinesService) {}

  /**
   * GET /airlines
   * Returns all airlines (102 airlines)
   */
  @Get()
  async getAllAirlines() {
    this.logger.log('GET /airlines - Fetching all airlines');
    return this.airlinesService.getAllAirlines();
  }

  /**
   * GET /airlines/search?q=air
   * Search airlines by IATA, ICAO, or name
   */
  @Get('search')
  async searchAirlines(@Query('q') query: string) {
    if (!query || query.trim().length < 1) {
      this.logger.warn('GET /airlines/search - Missing or invalid query parameter');
      return [];
    }

    this.logger.log(`GET /airlines/search?q=${query}`);
    return this.airlinesService.searchAirlines(query);
  }

  /**
   * GET /airlines/by-code?code=AF
   * Get specific airline by IATA code
   */
  @Get('by-code')
  async getAirlineByCode(@Query('code') code: string) {
    if (!code || code.trim().length !== 2) {
      this.logger.warn('GET /airlines/by-code - Invalid code parameter');
      return { error: 'Invalid IATA code. Must be 2 characters.' };
    }

    this.logger.log(`GET /airlines/by-code?code=${code}`);
    const airline = await this.airlinesService.getAirlineByCode(code);

    if (!airline) {
      return { error: `Airline with code ${code} not found` };
    }

    return airline;
  }

  /**
   * GET /airlines/by-alliance?alliance=Star%20Alliance
   * Get airlines by alliance
   */
  @Get('by-alliance')
  async getAirlinesByAlliance(@Query('alliance') alliance: string) {
    if (!alliance || alliance.trim().length < 1) {
      this.logger.warn('GET /airlines/by-alliance - Missing alliance parameter');
      return [];
    }

    this.logger.log(`GET /airlines/by-alliance?alliance=${alliance}`);
    return this.airlinesService.getAirlinesByAlliance(alliance);
  }

  /**
   * GET /airlines/stats
   * Get airlines statistics (total, by alliance, top countries)
   */
  @Get('stats')
  async getAirlinesStats() {
    this.logger.log('GET /airlines/stats - Fetching statistics');
    return this.airlinesService.getAirlinesStats();
  }
}
