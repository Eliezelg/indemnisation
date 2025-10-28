import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { AdminDocumentsController } from './admin-documents.controller';
import { DocumentsService } from './documents.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsController, AdminDocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
