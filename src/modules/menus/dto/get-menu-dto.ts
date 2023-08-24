import { PaginationDto } from '@/common/dto/pagination.dto';

export class GetMenuDto extends PaginationDto {
  id: number;
  name: string;
  path: string;
  sortNo: number;
  acl: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  // TODO多对多关系
  // roles:
}
