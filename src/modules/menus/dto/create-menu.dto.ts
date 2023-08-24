import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsOptional()
  order: number;

  @IsString()
  @IsOptional()
  acl: string;

  @IsString()
  @IsOptional()
  icon: string;
}
