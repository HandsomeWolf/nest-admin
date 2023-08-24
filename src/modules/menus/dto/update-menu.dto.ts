import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends CreateMenuDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
