import { CreateRoleDto } from './create-role.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRoleDto extends CreateRoleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
