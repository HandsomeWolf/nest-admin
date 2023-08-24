import { PaginationDto } from '@/common/dto/pagination.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetLogsDto extends PaginationDto {
  id: number;
  path: string;
  methods: string;
  data: string;
  ip: string;
  result: string;
  userName: string;
}

export class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class PublicLogsDto {
  msg: string;

  name: string;
}
