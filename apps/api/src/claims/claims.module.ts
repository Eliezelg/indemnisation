import { Module } from '@nestjs/common';
import { ClaimsController } from './claims.controller';
import { AdminClaimsController } from './admin-claims.controller';
import { ClaimsService } from './claims.service';
import { CompensationModule } from '../compensation/compensation.module';

@Module({
  imports: [CompensationModule],
  controllers: [ClaimsController, AdminClaimsController],
  providers: [ClaimsService],
  exports: [ClaimsService],
})
export class ClaimsModule {}
