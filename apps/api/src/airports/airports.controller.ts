import { Controller, Get, Query } from '@nestjs/common';
import { AirportsService } from './airports.service';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  /**
   * Search airports by query (IATA code, name, city, or country)
   * GET /airports/search?q=paris
   * GET /airports/search?q=CDG
   */
  @Get('search')
  async searchAirports(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return [];
    }

    return this.airportsService.searchAirports(query);
  }

  /**
   * Get all airports
   * GET /airports
   */
  @Get()
  async getAllAirports() {
    return this.airportsService.getAllAirports();
  }

  /**
   * Get airport by IATA code
   * GET /airports/by-code?code=CDG
   */
  @Get('by-code')
  async getAirportByCode(@Query('code') code: string) {
    if (!code || code.length !== 3) {
      return null;
    }

    return this.airportsService.getAirportByCode(code.toUpperCase());
  }
}
