import {
  IsIn,
  // IsNotEmpty,
  // IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  @IsIn([0, 1, 2])
  gender: number;

  @IsString()
  @IsOptional()
  photo: string;

  @IsString()
  @IsOptional()
  address: string;

  // @IsNumber()
  // @IsNotEmpty()
  // userId: number;
}
