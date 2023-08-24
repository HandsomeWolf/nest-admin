import { Type } from 'class-transformer';
import { GetProfileDto } from './get-profile.dto';
import { GetLogsDto } from '@/modules/logs/dto/get-log.dto';
import { GetRoleDto } from '@/modules/roles/dto/get-role.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class PublicUserDto extends PaginationDto {
  id: number;

  username: string;

  password: string;

  name: string;

  @Type(() => GetLogsDto)
  logs: GetLogsDto[];

  @Type(() => GetRoleDto)
  roles: GetRoleDto[];

  @Type(() => GetProfileDto)
  profile: GetProfileDto;
}
