import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserOnRolesDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
