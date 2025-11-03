import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentType, DocumentStatus } from '@prisma/client';
import { R2StorageService } from './r2-storage.service';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private r2Storage: R2StorageService,
  ) {}

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

    // Upload to R2
    const fileUrl = await this.r2Storage.uploadFile(
      file.buffer,
      fileName,
      file.mimetype,
      'documents',
    );

    // Save document metadata to database
    const document = await this.prisma.document.create({
      data: {
        claimId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: fileUrl, // Store R2 URL
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

    // Delete file from R2
    try {
      await this.r2Storage.deleteFile(document.filePath);
    } catch (error) {
      console.error('Failed to delete file from R2:', error);
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

    // Generate signed URL for download
    const signedUrl = await this.r2Storage.getSignedDownloadUrl(document.filePath);

    return {
      fileUrl: signedUrl,
      fileName: document.fileName,
      fileType: document.fileType,
    };
  }

  // ====== ADMIN METHODS ======

  async getAllPendingDocuments() {
    return this.prisma.document.findMany({
      where: { status: DocumentStatus.PENDING },
      include: {
        claim: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async validateDocument(documentId: string, status: DocumentStatus, rejectionReason?: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document non trouvé');
    }

    return this.prisma.document.update({
      where: { id: documentId },
      data: {
        status,
      },
    });
  }

  async getDocumentFileAdmin(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Document non trouvé');
    }

    // Generate signed URL for download
    const signedUrl = await this.r2Storage.getSignedDownloadUrl(document.filePath);

    return {
      fileUrl: signedUrl,
      fileName: document.fileName,
      fileType: document.fileType,
    };
  }
}
