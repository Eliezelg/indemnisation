import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightApiController } from './flight-api.controller';
import { FlightApiService } from './flight-api.service';
import { FlightApiNewService } from './flight-api-new.service';
import { FlightAPIProvider } from './providers/flightapi.provider';
import { MockFlightProvider } from './providers/mock.provider';

@Module({
  imports: [HttpModule],
  controllers: [FlightApiController],
  providers: [
    FlightApiService, // Keep old service for backward compatibility
    FlightApiNewService, // New service with provider pattern
    FlightAPIProvider,
    MockFlightProvider,
  ],
  exports: [FlightApiService, FlightApiNewService],
})
export class FlightApiModule {}
