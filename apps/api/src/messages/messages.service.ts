import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

  /**
   * Create a new message
   */
  async createMessage(userId: string, userRole: string, dto: CreateMessageDto) {
    // Verify claim exists and user has access
    const claim = await this.prisma.claim.findUnique({
      where: { id: dto.claimId },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    // Users can only send messages on their own claims
    if (userRole !== 'ADMIN' && claim.userId !== userId) {
      throw new ForbiddenException('You can only send messages on your own claims');
    }

    // If receiverId is provided, verify it exists
    if (dto.receiverId) {
      const receiver = await this.prisma.user.findUnique({
        where: { id: dto.receiverId },
      });

      if (!receiver) {
        throw new NotFoundException('Receiver not found');
      }
    }

    const message = await this.prisma.message.create({
      data: {
        claimId: dto.claimId,
        senderId: userId,
        receiverId: dto.receiverId,
        content: dto.content,
        isAdminMessage: userRole === 'ADMIN',
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        attachments: true,
      },
    });

    this.logger.log(
      `Message created: ${message.id} on claim ${dto.claimId} by ${userRole}`,
      'MessagesService',
    );

    return message;
  }

  /**
   * Get all messages for a claim
   */
  async getClaimMessages(userId: string, userRole: string, claimId: string) {
    // Verify claim exists and user has access
    const claim = await this.prisma.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    // Users can only view messages on their own claims
    if (userRole !== 'ADMIN' && claim.userId !== userId) {
      throw new ForbiddenException('You can only view messages on your own claims');
    }

    const messages = await this.prisma.message.findMany({
      where: { claimId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        attachments: true,
      },
    });

    return messages;
  }

  /**
   * Mark message as read
   */
  async markAsRead(userId: string, userRole: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        claim: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Only the receiver or admin can mark as read
    if (userRole !== 'ADMIN' && message.receiverId !== userId) {
      throw new ForbiddenException('You can only mark your own messages as read');
    }

    const updated = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    this.logger.log(`Message ${messageId} marked as read by ${userId}`, 'MessagesService');

    return updated;
  }

  /**
   * Get unread message count for user
   */
  async getUnreadCount(userId: string, userRole: string) {
    if (userRole === 'ADMIN') {
      // Admin sees all unread messages sent by users
      return this.prisma.message.count({
        where: {
          isRead: false,
          isAdminMessage: false,
        },
      });
    } else {
      // Users see unread messages sent to them (admin messages)
      return this.prisma.message.count({
        where: {
          receiverId: userId,
          isRead: false,
        },
      });
    }
  }

  /**
   * Get all user's messages across all claims (admin only)
   */
  async getAllMessages(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          claim: {
            select: {
              id: true,
              claimNumber: true,
              status: true,
            },
          },
          attachments: true,
        },
      }),
      this.prisma.message.count(),
    ]);

    return {
      messages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get recent messages for a user
   */
  async getUserRecentMessages(userId: string, userRole: string) {
    if (userRole === 'ADMIN') {
      // Admin sees recent messages from all users
      return this.prisma.message.findMany({
        where: {
          isAdminMessage: false,
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          claim: {
            select: {
              id: true,
              claimNumber: true,
              status: true,
            },
          },
        },
      });
    } else {
      // Users see their own sent messages and received admin messages
      return this.prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          claim: {
            select: {
              id: true,
              claimNumber: true,
              status: true,
            },
          },
        },
      });
    }
  }
}
