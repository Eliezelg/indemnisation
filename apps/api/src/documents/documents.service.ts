import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentType } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'documents');

  constructor(private prisma: PrismaService) {
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  async uploadDocument(
    file: Express.Multer.File,
    claimId: string,
    documentType: DocumentType,
    userId: string,
  ) {
    // Verify the claim exists and belongs to the user
    const claim = await this.prisma.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new NotFoundException('Réclamation non trouvée');
    }

    if (claim.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette réclamation");
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Type de fichier non autorisé. Formats acceptés: JPG, PNG, WEBP, PDF',
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'Fichier trop volumineux. Taille maximale: 5MB',
      );
    }

    // Generate unique filename
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Save file to disk
    await fs.writeFile(filePath, file.buffer);

    // Save document metadata to database
    const document = await this.prisma.document.create({
      data: {
        claimId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: fileName, // Store relative path
        documentType,
      },
    });

    return document;
  }

  async getDocumentsByClaimId(claimId: string, userId: string) {
    // Verify the claim belongs to the user
    const claim = await this.prisma.claim.findUnique({
      where: { id: claimId },
    });

    if (!claim) {
      throw new NotFoundException('Réclamation non trouvée');
    }

    if (claim.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette réclamation");
    }

    return this.prisma.document.findMany({
      where: { claimId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async deleteDocument(documentId: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { claim: true },
    });

    if (!document) {
      throw new NotFoundException('Document non trouvé');
    }

    if (document.claim.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à ce document");
    }

    // Delete file from disk
    const filePath = path.join(this.uploadDir, document.filePath);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Failed to delete file from disk:', error);
    }

    // Delete from database
    await this.prisma.document.delete({
      where: { id: documentId },
    });

    return { message: 'Document supprimé avec succès' };
  }

  async getDocumentFile(documentId: string, userId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { claim: true },
    });

    if (!document) {
      throw new NotFoundException('Document non trouvé');
    }

    if (document.claim.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à ce document");
    }

    const filePath = path.join(this.uploadDir, document.filePath);

    try {
      await fs.access(filePath);
    } catch {
      throw new NotFoundException('Fichier non trouvé sur le serveur');
    }

    return {
      filePath,
      fileName: document.fileName,
      fileType: document.fileType,
    };
  }
}
