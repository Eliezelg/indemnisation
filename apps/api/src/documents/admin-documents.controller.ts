import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { DocumentsService } from './documents.service';
import { DocumentStatus } from '@prisma/client';

@Controller('admin/documents')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminDocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('pending')
  async getPendingDocuments() {
    return this.documentsService.getAllPendingDocuments();
  }

  @Patch(':id/validate')
  async validateDocument(
    @Param('id') documentId: string,
    @Body() body: { status: DocumentStatus; rejectionReason?: string },
  ) {
    return this.documentsService.validateDocument(
      documentId,
      body.status,
      body.rejectionReason,
    );
  }

  @Get(':id/download')
  async downloadDocumentAdmin(
    @Param('id') documentId: string,
    @Res() res: FastifyReply,
  ) {
    const { filePath, fileName, fileType } =
      await this.documentsService.getDocumentFileAdmin(documentId);

    const fs = require('fs');
    const stream = fs.createReadStream(filePath);

    res.header('Content-Type', fileType);
    res.header('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(stream);
  }
}
