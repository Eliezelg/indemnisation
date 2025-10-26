import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompensationService } from '../compensation/compensation.service';
import { EmailService } from '../email/email.service';
import { CreateClaimDto } from './dto';

@Injectable()
export class ClaimsService {
  constructor(
    private prisma: PrismaService,
    private compensationService: CompensationService,
    private emailService: EmailService,
  ) {}

  /**
   * Create a new claim with automatic compensation calculation
   */
  async create(userId: string, dto: CreateClaimDto) {
    // Get user data for email
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        preferredLocale: true,
      },
    });

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

    // Send claim created email (non-blocking)
    if (user) {
      this.emailService.sendClaimCreatedEmail(
        user.email,
        {
          firstName: user.firstName,
          lastName: user.lastName,
          claimId: claim.id,
          claimNumber: claim.claimNumber,
          flightNumber: claim.flightNumber,
          departureAirport: claim.departureAirport,
          arrivalAirport: claim.arrivalAirport,
          recommendedAmount: Number(claim.recommendedAmount),
          currency: '€',
        },
        user.preferredLocale as 'fr' | 'he' | 'en',
      );
    }

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

    // Get user data for email
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        preferredLocale: true,
      },
    });

    // Update claim status
    const updatedClaim = await this.prisma.claim.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    // Send status change email (non-blocking)
    if (user) {
      this.emailService.sendClaimStatusEmail(
        user.email,
        {
          firstName: user.firstName,
          lastName: user.lastName,
          claimId: updatedClaim.id,
          claimNumber: updatedClaim.claimNumber,
          flightNumber: updatedClaim.flightNumber,
          status: 'SUBMITTED',
        },
        user.preferredLocale as 'fr' | 'he' | 'en',
      );
    }

    return updatedClaim;
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
