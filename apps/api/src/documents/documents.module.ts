import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { AdminDocumentsController } from './admin-documents.controller';
import { DocumentsService } from './documents.service';
import { R2StorageService } from './r2-storage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsController, AdminDocumentsController],
  providers: [DocumentsService, R2StorageService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
