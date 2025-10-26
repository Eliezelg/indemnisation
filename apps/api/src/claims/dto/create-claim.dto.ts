import { IsString, IsDateString, IsEnum, IsOptional, IsInt, Min, IsObject } from 'class-validator';
import { DisruptionType } from '@prisma/client';

export class CreateClaimDto {
  @IsString()
  flightNumber: string;

  @IsDateString()
  flightDate: string;

  @IsString()
  departureAirport: string; // IATA code

  @IsString()
  arrivalAirport: string; // IATA code

  @IsOptional()
  @IsString()
  airline?: string;

  @IsEnum(DisruptionType)
  disruptionType: DisruptionType;

  @IsOptional()
  @IsInt()
  @Min(0)
  delayMinutes?: number;

  @IsObject()
  passengerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bookingReference?: string;
  };
}
