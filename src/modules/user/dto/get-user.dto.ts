import { PaginationDto } from '@/common/dto/pagination.dto';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class getUserDto extends PaginationDto {
  id: number;

  username: string;

  @Exclude()
  password: string;

  name: string;

  @IsNumber()
  @IsOptional()
  role: number; //select 下拉框

  @IsNumber()
  @IsOptional()
  gender: number;
  /**
   * 用户状态
   *
   * 0: 禁用
   * 1: 启用
   */
  status: number;

  @Expose()
  get StatusName(): string {
    return this.status === 0 ? '禁用' : '启用';
  }

  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  roles: number[];
}
