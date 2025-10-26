import { IsEnum, IsString } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class UploadDocumentDto {
  @IsString()
  claimId: string;

  @IsEnum(DocumentType, { message: 'Type de document invalide' })
  documentType: DocumentType;
}
