import { IsString, IsDateString, IsEnum, IsOptional, IsInt, Min, IsObject, IsBoolean, IsArray } from 'class-validator';
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

  @IsOptional()
  @IsBoolean()
  hasContactedCompany?: boolean;

  @IsOptional()
  @IsString()
  companyContactDetails?: string;

  @IsOptional()
  @IsArray()
  additionalExpenses?: Array<{
    type: string;
    amount: string;
    description: string;
  }>;

  @IsObject()
  passengerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bookingReference?: string;
  };
}
