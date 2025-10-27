import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClaimStatus } from '@prisma/client';

export interface OverviewStats {
  totalClaims: number;
  claimsByStatus: Record<ClaimStatus, number>;
  pendingReview: number;
  approvedThisMonth: number;
  averageAmount: number;
  documentsToValidate: number;
}

export interface ClaimsByMonth {
  month: string; // Format: "2025-01"
  count: number;
  totalAmount: number;
}

export interface TopAirline {
  airline: string;
  count: number;
  averageAmount: number;
}

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get overview statistics for admin dashboard
   */
  async getOverviewStats(): Promise<OverviewStats> {
    // Total claims
    const totalClaims = await this.prisma.claim.count();

    // Claims by status
    const claimsByStatusRaw = await this.prisma.claim.groupBy({
      by: ['status'],
      _count: true,
    });

    const claimsByStatus: Record<ClaimStatus, number> = {
      DRAFT: 0,
      SUBMITTED: 0,
      IN_REVIEW: 0,
      APPROVED: 0,
      REJECTED: 0,
      PAID: 0,
      CANCELLED: 0,
    };

    claimsByStatusRaw.forEach((item) => {
      claimsByStatus[item.status] = item._count;
    });

    // Pending review (SUBMITTED + IN_REVIEW)
    const pendingReview = claimsByStatus.SUBMITTED + claimsByStatus.IN_REVIEW;

    // Approved this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const approvedThisMonth = await this.prisma.claim.count({
      where: {
        status: ClaimStatus.APPROVED,
        updatedAt: {
          gte: startOfMonth,
        },
      },
    });

    // Average amount (of non-draft claims with amount)
    const avgAmountResult = await this.prisma.claim.aggregate({
      _avg: {
        recommendedAmount: true,
      },
      where: {
        status: {
          not: ClaimStatus.DRAFT,
        },
        recommendedAmount: {
          not: null,
        },
      },
    });

    const averageAmount = avgAmountResult._avg.recommendedAmount
      ? parseFloat(avgAmountResult._avg.recommendedAmount.toString())
      : 0;

    // Documents to validate (count documents with no status validation yet)
    // For now, just count all documents as we don't have validation status yet
    const documentsToValidate = await this.prisma.document.count();

    return {
      totalClaims,
      claimsByStatus,
      pendingReview,
      approvedThisMonth,
      averageAmount,
      documentsToValidate,
    };
  }

  /**
   * Get claims grouped by month for the last N months
   */
  async getClaimsByMonth(months: number = 6): Promise<ClaimsByMonth[]> {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - months);

    const claims = await this.prisma.claim.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        status: {
          not: ClaimStatus.DRAFT,
        },
      },
      select: {
        createdAt: true,
        recommendedAmount: true,
      },
    });

    // Group by month
    const monthsMap = new Map<string, { count: number; totalAmount: number }>();

    claims.forEach((claim) => {
      const month = claim.createdAt.toISOString().slice(0, 7); // "2025-01"

      if (!monthsMap.has(month)) {
        monthsMap.set(month, { count: 0, totalAmount: 0 });
      }

      const data = monthsMap.get(month)!;
      data.count += 1;
      data.totalAmount += claim.recommendedAmount
        ? parseFloat(claim.recommendedAmount.toString())
        : 0;
    });

    // Convert to array and sort
    const result: ClaimsByMonth[] = Array.from(monthsMap.entries())
      .map(([month, data]) => ({
        month,
        count: data.count,
        totalAmount: data.totalAmount,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return result;
  }

  /**
   * Get top airlines by claim count
   */
  async getTopAirlines(limit: number = 5): Promise<TopAirline[]> {
    const airlines = await this.prisma.claim.groupBy({
      by: ['airline'],
      _count: true,
      _avg: {
        recommendedAmount: true,
      },
      where: {
        airline: {
          not: null,
        },
        status: {
          not: ClaimStatus.DRAFT,
        },
      },
      orderBy: {
        _count: {
          airline: 'desc',
        },
      },
      take: limit,
    });

    return airlines.map((item) => ({
      airline: item.airline || 'Unknown',
      count: item._count,
      averageAmount: item._avg.recommendedAmount
        ? parseFloat(item._avg.recommendedAmount.toString())
        : 0,
    }));
  }

  /**
   * Get recent claims (last N claims)
   */
  async getRecentClaims(limit: number = 10) {
    return this.prisma.claim.findMany({
      where: {
        status: {
          not: ClaimStatus.DRAFT,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
}
