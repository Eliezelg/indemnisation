export class MessageAttachmentDto {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  uploadedAt: Date;
}

export class MessageSenderDto {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export class MessageResponseDto {
  id: string;
  claimId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  isAdminMessage: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: MessageSenderDto;
  receiver?: MessageSenderDto;
  attachments: MessageAttachmentDto[];
}
