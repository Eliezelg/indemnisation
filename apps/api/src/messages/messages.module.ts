import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { MessagesAttachmentsService } from './messages-attachments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesAttachmentsService,
    {
      provide: MessagesGateway,
      useClass: MessagesGateway,
    },
  ],
  exports: [MessagesService, MessagesGateway, MessagesAttachmentsService],
})
export class MessagesModule {}
