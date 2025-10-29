import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../logger/logger.service';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class MessagesAttachmentsService {
  private readonly uploadsDir = process.env.UPLOAD_DIR || path.join(process.cwd(), '../../uploads/messages');

  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {
    // Ensure uploads directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
      this.logger.log(`Message uploads directory ensured: ${this.uploadsDir}`, 'MessagesAttachmentsService');
    } catch (error) {
      this.logger.error(`Failed to create uploads directory: ${error.message}`, 'MessagesAttachmentsService');
    }
  }

  /**
   * Upload attachment for a message
   */
  async uploadAttachment(
    userId: string,
    userRole: string,
    messageId: string,
    file: any,
  ) {
    // Verify message exists and user has access
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        claim: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check access rights
    if (userRole !== 'ADMIN' && message.claim.userId !== userId) {
      throw new ForbiddenException('You can only add attachments to your own messages');
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new ForbiddenException('File size exceeds 10MB limit');
    }

    // Generate unique filename
    const ext = path.extname(file.originalname);
    const filename = `${messageId}-${Date.now()}${ext}`;
    const filepath = path.join(this.uploadsDir, filename);

    // Save file
    await fs.writeFile(filepath, file.buffer);

    // Create attachment record
    const attachment = await this.prisma.messageAttachment.create({
      data: {
        messageId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: filepath,
      },
    });

    this.logger.log(
      `Attachment uploaded: ${attachment.id} for message ${messageId}`,
      'MessagesAttachmentsService',
    );

    return attachment;
  }

  /**
   * Get attachment file
   */
  async getAttachment(userId: string, userRole: string, attachmentId: string) {
    const attachment = await this.prisma.messageAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        message: {
          include: {
            claim: true,
          },
        },
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    // Check access rights
    if (userRole !== 'ADMIN' && attachment.message.claim.userId !== userId) {
      throw new ForbiddenException('You can only access attachments from your own messages');
    }

    return attachment;
  }

  /**
   * Delete attachment
   */
  async deleteAttachment(userId: string, userRole: string, attachmentId: string) {
    const attachment = await this.getAttachment(userId, userRole, attachmentId);

    // Delete file from disk
    try {
      await fs.unlink(attachment.filePath);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, 'MessagesAttachmentsService');
    }

    // Delete record
    await this.prisma.messageAttachment.delete({
      where: { id: attachmentId },
    });

    this.logger.log(`Attachment deleted: ${attachmentId}`, 'MessagesAttachmentsService');

    return { success: true };
  }

  /**
   * Get attachments for a message
   */
  async getMessageAttachments(userId: string, userRole: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        claim: true,
        attachments: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check access rights
    if (userRole !== 'ADMIN' && message.claim.userId !== userId) {
      throw new ForbiddenException('You can only access attachments from your own messages');
    }

    return message.attachments;
  }
}
