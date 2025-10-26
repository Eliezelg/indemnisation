import { Module } from '@nestjs/common';
import { CompensationService } from './compensation.service';
import { DistanceService } from './distance.service';
import { EUCalculatorService } from './eu-calculator.service';
import { IsraelCalculatorService } from './israel-calculator.service';
import { JurisdictionService } from './jurisdiction.service';

@Module({
  providers: [
    CompensationService,
    DistanceService,
    EUCalculatorService,
    IsraelCalculatorService,
    JurisdictionService,
  ],
  exports: [CompensationService],
})
export class CompensationModule {}
