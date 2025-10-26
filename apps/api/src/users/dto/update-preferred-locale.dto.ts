import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePreferredLocaleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['fr', 'he', 'en'], {
    message: 'Locale must be one of: fr, he, en',
  })
  locale: string;
}
