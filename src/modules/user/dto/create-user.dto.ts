import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 20, {
    message: '用户名长度必须在4-20之间',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64, {
    message: '密码长度必须在6-64之间',
  })
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  @IsIn([0, 1])
  status: number;
}

// 创建带角色的用户
export class CreateUserWithRolesDto extends CreateUserDto {
  @IsOptional()
  // // IsNumber是class-validator包中的装饰器。第一个参数为选项，例如@IsNumber({ min: 1, max: 10 }); 第二个参数each: true表示验证数组中每个元素
  @IsNumber({}, { each: true })
  // Type是class-transformer包中的装饰器，作用是将序列化和反序列化时的类型转换为数字
  @Type(() => Number)
  roles: number[];
}

// 创建带角色的用户类型声明
export interface CreateUserWithRolesInterface extends CreateUserDto {
  roles: {
    create: Array<{
      roleId: number;
    }>;
  };
}
