import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async register(username: string, password: string) {
    const user = await this.prisma.users.findUnique({ where: { username } });
    if (user) {
      throw new ForbiddenException('用户已存在');
    }
    const res = await this.prisma.users.create({
      data: {
        username,
        password: await argon2.hash(password),
      },
    });
    return res;
  }
  async login(username: string, password: string) {
    const user = await this.prisma.users.findUnique({ where: { username } });
    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }
    // 用户密码比对
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或密码错误');
    }
    return await this.jwt.signAsync({
      username: user.username,
      sub: user.id,
    });
  }
}
