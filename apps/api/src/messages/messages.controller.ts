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
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

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
}
