import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
  Delete,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { createReadStream } from 'fs';
import { MessagesService } from './messages.service';
import { MessagesAttachmentsService } from './messages-attachments.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly attachmentsService: MessagesAttachmentsService,
  ) {}

  @Post()
  async createMessage(@Request() req, @Body() dto: CreateMessageDto) {
    return this.messagesService.createMessage(req.user.sub, req.user.role, dto);
  }

  @Get('claim/:claimId')
  async getClaimMessages(@Request() req, @Param('claimId') claimId: string) {
    return this.messagesService.getClaimMessages(req.user.sub, req.user.role, claimId);
  }

  @Patch(':messageId/read')
  async markAsRead(@Request() req, @Param('messageId') messageId: string) {
    return this.messagesService.markAsRead(req.user.sub, req.user.role, messageId);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return {
      count: await this.messagesService.getUnreadCount(req.user.sub, req.user.role),
    };
  }

  @Get('recent')
  async getRecentMessages(@Request() req) {
    return this.messagesService.getUserRecentMessages(req.user.sub, req.user.role);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  async getAllMessages(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
  ) {
    return this.messagesService.getAllMessages(parseInt(page, 10), parseInt(limit, 10));
  }

  // ==================== ATTACHMENTS ====================

  @Post(':messageId/attachments')
  async uploadAttachment(
    @Request() req: FastifyRequest & { user: any },
    @Param('messageId') messageId: string,
  ) {
    // Get the file from multipart request
    const data = await req.file();
    if (!data) {
      throw new Error('No file uploaded');
    }

    const buffer = await data.toBuffer();
    const file = {
      originalname: data.filename,
      mimetype: data.mimetype,
      size: buffer.length,
      buffer,
    };

    return this.attachmentsService.uploadAttachment(
      req.user.sub,
      req.user.role,
      messageId,
      file,
    );
  }

  @Get('attachments/:attachmentId')
  async downloadAttachment(
    @Request() req,
    @Param('attachmentId') attachmentId: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const attachment = await this.attachmentsService.getAttachment(
      req.user.sub,
      req.user.role,
      attachmentId,
    );

    const stream = createReadStream(attachment.filePath);

    res.header('Content-Type', attachment.fileType);
    res.header('Content-Disposition', `attachment; filename="${attachment.fileName}"`);

    return new StreamableFile(stream);
  }

  @Delete('attachments/:attachmentId')
  async deleteAttachment(@Request() req, @Param('attachmentId') attachmentId: string) {
    return this.attachmentsService.deleteAttachment(
      req.user.sub,
      req.user.role,
      attachmentId,
    );
  }

  @Get(':messageId/attachments')
  async getMessageAttachments(@Request() req, @Param('messageId') messageId: string) {
    return this.attachmentsService.getMessageAttachments(
      req.user.sub,
      req.user.role,
      messageId,
    );
  }
}
