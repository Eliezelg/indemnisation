import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  },
  namespace: '/messages',
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);
  private connectedUsers = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private typingUsers = new Map<string, Set<string>>(); // claimId -> Set<userId>

  constructor(
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Connection rejected: No token provided`);
        client.disconnect();
        return;
      }

      // Verify token
      const payload = await this.jwtService.verifyAsync(token);
      client.userId = payload.sub;
      client.userRole = payload.role;

      // Track connected user
      if (!this.connectedUsers.has(client.userId)) {
        this.connectedUsers.set(client.userId, new Set());
      }
      this.connectedUsers.get(client.userId).add(client.id);

      this.logger.log(`Client connected: ${client.id} (User: ${client.userId})`);
      this.loggerService.log(
        `WebSocket connection established for user ${client.userId}`,
        'MessagesGateway',
      );

      // Emit connection success
      client.emit('connected', { userId: client.userId });
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSockets = this.connectedUsers.get(client.userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.connectedUsers.delete(client.userId);
        }
      }

      // Clean up typing indicators
      this.typingUsers.forEach((users, claimId) => {
        if (users.has(client.userId)) {
          users.delete(client.userId);
          this.emitTypingUpdate(claimId);
        }
      });

      this.logger.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
      this.loggerService.log(
        `WebSocket disconnected for user ${client.userId}`,
        'MessagesGateway',
      );
    }
  }

  @SubscribeMessage('join_claim')
  handleJoinClaim(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { claimId: string },
  ) {
    client.join(`claim:${data.claimId}`);
    this.logger.log(`Client ${client.id} joined claim:${data.claimId}`);
    return { event: 'joined_claim', claimId: data.claimId };
  }

  @SubscribeMessage('leave_claim')
  handleLeaveClaim(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { claimId: string },
  ) {
    client.leave(`claim:${data.claimId}`);
    this.logger.log(`Client ${client.id} left claim:${data.claimId}`);
    return { event: 'left_claim', claimId: data.claimId };
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { claimId: string },
  ) {
    if (!this.typingUsers.has(data.claimId)) {
      this.typingUsers.set(data.claimId, new Set());
    }
    this.typingUsers.get(data.claimId).add(client.userId);
    this.emitTypingUpdate(data.claimId);
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { claimId: string },
  ) {
    const users = this.typingUsers.get(data.claimId);
    if (users) {
      users.delete(client.userId);
      this.emitTypingUpdate(data.claimId);
    }
  }

  @SubscribeMessage('message_read')
  async handleMessageRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { messageId: string },
  ) {
    try {
      // Mark as read directly in DB
      const message = await this.prisma.message.update({
        where: { id: data.messageId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      // Notify sender that message was read
      this.emitToUser(message.senderId, 'message_read_receipt', {
        messageId: message.id,
        readAt: message.readAt,
      });

      this.loggerService.log(`Message ${data.messageId} marked as read by ${client.userId}`, 'MessagesGateway');

      return { success: true };
    } catch (error) {
      this.logger.error(`Error marking message as read: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Emit a new message to all users in a claim room
   */
  emitNewMessage(claimId: string, message: any) {
    this.server.to(`claim:${claimId}`).emit('new_message', message);
    this.logger.log(`Emitted new message to claim:${claimId}`);
  }

  /**
   * Emit message read receipt to a specific user
   */
  emitToUser(userId: string, event: string, data: any) {
    const userSockets = this.connectedUsers.get(userId);
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }

  /**
   * Emit typing update to claim room
   */
  private emitTypingUpdate(claimId: string) {
    const typingUsers = Array.from(this.typingUsers.get(claimId) || []);
    this.server.to(`claim:${claimId}`).emit('typing_update', {
      claimId,
      typingUsers,
    });
  }

  /**
   * Check if a user is online
   */
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Get all online users
   */
  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}
