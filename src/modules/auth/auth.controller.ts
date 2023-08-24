import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RedisService } from '@/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}
  @Post('login')
  async login(@Body() dto: any) {
    const { username, password } = dto;
    const token = await this.authService.login(username, password);
    await this.redisService.set(username, token);
    return {
      access_token: token,
    };
  }

  @Post('register')
  register(@Body() dto: LoginUserDto) {
    const { username, password } = dto;
    return this.authService.register(username, password);
  }
}
