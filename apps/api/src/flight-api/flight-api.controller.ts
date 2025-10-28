import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { FlightApiNewService } from './flight-api-new.service';

@Controller('flight-api')
export class FlightApiController {
  constructor(private flightApiService: FlightApiNewService) {}

  @Get('search')
  async searchFlight(
    @Query('flightNumber') flightNumber: string,
    @Query('date') date: string,
  ) {
    if (!flightNumber || !date) {
      throw new BadRequestException(
        'Flight number and date are required',
      );
    }

    const flightData = await this.flightApiService.searchFlight(
      flightNumber,
      date,
    );

    if (!flightData) {
      return {
        found: false,
        message: 'Flight not found',
      };
    }

    // Calculate delay if actual times are available
    let delayMinutes: number | undefined;
    if (flightData.actualArrivalTime && flightData.arrivalTime) {
      delayMinutes = this.flightApiService.calculateDelay(
        flightData.arrivalTime,
        flightData.actualArrivalTime,
      );
    }

    return {
      found: true,
      data: {
        ...flightData,
        delayMinutes,
        airlineLogo: this.flightApiService.getAirlineLogo(
          flightData.airlineCode,
        ),
      },
    };
  }

  @Get('airline-logo')
  async getAirlineLogo(@Query('code') airlineCode: string) {
    if (!airlineCode) {
      throw new BadRequestException('Airline code is required');
    }

    return {
      logo: this.flightApiService.getAirlineLogo(airlineCode),
    };
  }
}
