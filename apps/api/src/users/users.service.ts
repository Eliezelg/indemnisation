import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async updatePreferredLocale(userId: string, locale: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { preferredLocale: locale },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        preferredLocale: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // ====== ADMIN METHODS ======

  /**
   * Get all users (admin only)
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        preferredLocale: true,
        createdAt: true,
        _count: {
          select: {
            claims: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const totalUsers = await this.prisma.user.count();
    const adminUsers = await this.prisma.user.count({
      where: { role: 'ADMIN' },
    });
    const verifiedUsers = await this.prisma.user.count({
      where: { emailVerified: true },
    });

    return {
      totalUsers,
      adminUsers,
      clientUsers: totalUsers - adminUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
    };
  }
}
