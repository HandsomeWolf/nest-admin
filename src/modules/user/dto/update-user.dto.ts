import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto extends CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

// 创建带角色的用户
export class UpdateUserWithRolesDto extends UpdateUserDto {
  @IsOptional()
  // // IsNumber是class-validator包中的装饰器。第一个参数为选项，例如@IsNumber({ min: 1, max: 10 }); 第二个参数each: true表示验证数组中每个元素
  @IsNumber({}, { each: true })
  // Type是class-transformer包中的装饰器，作用是将序列化和反序列化时的类型转换为数字
  @Type(() => Number)
  roles: number[];
}

// 创建带角色的用户类型声明
export interface UpdateUserWithRolesInterface extends UpdateUserDto {
  roles: {
    create: Array<{
      roleId: number;
    }>;
  };
}
