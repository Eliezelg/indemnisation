export enum DocumentType {
  BOARDING_PASS = 'BOARDING_PASS',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  ID_DOCUMENT = 'ID_DOCUMENT',
  PROOF_OF_DELAY = 'PROOF_OF_DELAY',
  OTHER = 'OTHER',
}

export interface Document {
  id: string;
  claimId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  documentType: DocumentType;
  uploadedAt: string;
}
