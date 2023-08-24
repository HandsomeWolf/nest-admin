import { PaginationDto } from '@/common/dto/pagination.dto';

export class GetRoleDto extends PaginationDto {
  id: number;
  name: string;
  description: string;
}
