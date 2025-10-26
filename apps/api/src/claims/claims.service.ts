import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompensationService } from '../compensation/compensation.service';
import { CreateClaimDto } from './dto';

@Injectable()
export class ClaimsService {
  constructor(
    private prisma: PrismaService,
    private compensationService: CompensationService,
  ) {}

  /**
   * Create a new claim with automatic compensation calculation
   */
  async create(userId: string, dto: CreateClaimDto) {
    // Calculate compensation
    const compensation = await this.compensationService.calculateCompensation(
      dto.departureAirport,
      dto.arrivalAirport,
      dto.disruptionType,
      dto.delayMinutes,
      dto.airline,
    );

    // Generate unique claim number
    const claimNumber = await this.generateClaimNumber();

    // Create claim
    const claim = await this.prisma.claim.create({
      data: {
        claimNumber,
        userId,
        flightNumber: dto.flightNumber,
        flightDate: new Date(dto.flightDate),
        departureAirport: dto.departureAirport.toUpperCase(),
        arrivalAirport: dto.arrivalAirport.toUpperCase(),
        airline: dto.airline,
        disruptionType: dto.disruptionType,
        delayMinutes: dto.delayMinutes,
        passengerInfo: dto.passengerInfo as any,
        calculatedAmountEU: compensation.calculatedAmountEU,
        calculatedAmountIL: compensation.calculatedAmountIL,
        recommendedAmount: compensation.recommendedAmount,
        jurisdiction: compensation.jurisdiction,
        distance: compensation.distance,
        status: 'DRAFT',
      },
    });

    return {
      ...claim,
      compensation: compensation.details,
    };
  }

  /**
   * Get all claims for a user
   */
  async findAllByUser(userId: string) {
    return this.prisma.claim.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a specific claim
   */
  async findOne(id: string, userId: string) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
    });

    if (!claim) {
      throw new NotFoundException('Réclamation introuvable');
    }

    // Check ownership
    if (claim.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé');
    }

    return claim;
  }

  /**
   * Submit a claim (change status from DRAFT to SUBMITTED)
   */
  async submit(id: string, userId: string) {
    const claim = await this.findOne(id, userId);

    if (claim.status !== 'DRAFT') {
      throw new ForbiddenException('Cette réclamation a déjà été soumise');
    }

    return this.prisma.claim.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });
  }

  /**
   * Generate unique claim number in format CLM-YYYY-NNNNNN
   */
  private async generateClaimNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `CLM-${year}-`;

    // Get the last claim for this year
    const lastClaim = await this.prisma.claim.findFirst({
      where: {
        claimNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        claimNumber: 'desc',
      },
    });

    let nextNumber = 1;

    if (lastClaim) {
      const lastNumber = parseInt(lastClaim.claimNumber.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    // Pad with zeros to 6 digits
    const paddedNumber = nextNumber.toString().padStart(6, '0');

    return `${prefix}${paddedNumber}`;
  }
}
