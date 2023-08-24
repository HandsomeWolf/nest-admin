import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '@/enum/config.enum';
import { RedisService } from '@/redis/redis.service';

export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const redisClient = this.redisService.getClient();
    // custom logic can go here
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    // const cacheToken = this.redis.get(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get(ConfigEnum.JWT_SECRET),
    });
    const username = payload['username'];
    const tokenCache = username ? await this.redisService.get(username) : null;
    if (!payload || !username || tokenCache !== token) {
      throw new UnauthorizedException();
    }

    const parentCanActivate = (await super.canActivate(context)) as boolean; // this is necessary due to possibly returning `boolean | Promise<boolean> | Observable<boolean>
    // custom logic goes here too
    return parentCanActivate;
  }
}

// 装饰器
// @JwtGuard()
