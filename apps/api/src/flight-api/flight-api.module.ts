import { Module } from '@nestjs/common';
import { FlightApiController } from './flight-api.controller';
import { FlightApiService } from './flight-api.service';

@Module({
  controllers: [FlightApiController],
  providers: [FlightApiService],
  exports: [FlightApiService],
})
export class FlightApiModule {}
