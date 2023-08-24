import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { IsValidValueInArr } from '../decorators/is-valid-value-in-arr.decorator';

class OrderType {
  // 不能加，因为是动态的@IsIn(['asc','desc'])
  [key: string]: 'asc' | 'desc';
}

export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  page = 1;

  @IsNumber()
  @Type(() => Number)
  size = 10;

  @Type(() => OrderType)
  @ValidateNested()
  @IsValidValueInArr(['asc', 'desc'])
  order: OrderType;
}
