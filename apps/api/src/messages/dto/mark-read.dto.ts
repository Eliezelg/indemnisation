import { IsUUID, IsNotEmpty } from 'class-validator';

export class MarkReadDto {
  @IsUUID()
  @IsNotEmpty()
  messageId: string;
}
