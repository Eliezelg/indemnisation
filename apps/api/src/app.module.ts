import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClaimsModule } from './claims/claims.module';
import { CompensationModule } from './compensation/compensation.module';
import { EmailModule } from './email/email.module';
import { DocumentsModule } from './documents/documents.module';
import { FlightApiModule } from './flight-api/flight-api.module';
import { StatsModule } from './stats/stats.module';
import { AirportsModule } from './airports/airports.module';
import { AirlinesModule } from './airlines/airlines.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    EmailModule,
    AuthModule,
    UsersModule,
    ClaimsModule,
    CompensationModule,
    DocumentsModule,
    FlightApiModule,
    StatsModule,
    AirportsModule,
    AirlinesModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
