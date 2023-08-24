import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
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
}
