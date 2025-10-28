import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { DocumentsService } from './documents.service';
import { DocumentType } from '@prisma/client';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload')
  async uploadDocument(
    @Req() req: FastifyRequest,
    @GetUser('id') userId: string,
  ) {
    const data = await req.file();

    if (!data) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Read file buffer
    const buffer = await data.toBuffer();

    // Get form fields
    const fields = data.fields as any;
    const claimId = fields.claimId?.value;
    const documentType = fields.documentType?.value as DocumentType;

    if (!claimId || !documentType) {
      throw new BadRequestException('claimId et documentType requis');
    }

    // Create Express.Multer.File compatible object
    const file: Express.Multer.File = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
      size: buffer.length,
      fieldname: 'file',
      encoding: data.encoding,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    return this.documentsService.uploadDocument(
      file,
      claimId,
      documentType,
      userId,
    );
  }

  @Get('claim/:claimId')
  async getDocumentsByClaimId(
    @Param('claimId') claimId: string,
    @GetUser('id') userId: string,
  ) {
    return this.documentsService.getDocumentsByClaimId(claimId, userId);
  }

  @Get(':id/download')
  async downloadDocument(
    @Param('id') documentId: string,
    @GetUser('id') userId: string,
    @Res() res: FastifyReply,
  ) {
    const { filePath, fileName, fileType } =
      await this.documentsService.getDocumentFile(documentId, userId);

    const fs = require('fs');
    const stream = fs.createReadStream(filePath);

    res.header('Content-Type', fileType);
    res.header('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(stream);
  }

  @Delete(':id')
  async deleteDocument(
    @Param('id') documentId: string,
    @GetUser('id') userId: string,
  ) {
    return this.documentsService.deleteDocument(documentId, userId);
  }
}
