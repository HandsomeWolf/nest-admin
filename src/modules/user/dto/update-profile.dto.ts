import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends CreateProfileDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
