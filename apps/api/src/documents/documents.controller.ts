import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @GetUser('id') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    return this.documentsService.uploadDocument(
      file,
      dto.claimId,
      dto.documentType,
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
    @Res() res: Response,
  ) {
    const { filePath, fileName, fileType } =
      await this.documentsService.getDocumentFile(documentId, userId);

    res.setHeader('Content-Type', fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.sendFile(filePath);
  }

  @Delete(':id')
  async deleteDocument(
    @Param('id') documentId: string,
    @GetUser('id') userId: string,
  ) {
    return this.documentsService.deleteDocument(documentId, userId);
  }
}
