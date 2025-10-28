import { Module } from '@nestjs/common';
import { AirlinesController } from './airlines.controller';
import { AirlinesService } from './airlines.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AirlinesController],
  providers: [AirlinesService],
  exports: [AirlinesService],
})
export class AirlinesModule {}
