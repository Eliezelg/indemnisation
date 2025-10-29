import { IsUUID, IsNotEmpty } from 'class-validator';

export class UploadAttachmentDto {
  @IsUUID()
  @IsNotEmpty()
  messageId: string;
}
