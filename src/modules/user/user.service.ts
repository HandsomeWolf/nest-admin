import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserWithRolesInterface,
} from './dto/create-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { getUserDto } from './dto/get-user.dto';
import { transformObjToArr } from '@/utils/pagination';
import * as argon2 from 'argon2';
import { CreateUserOnRolesDto } from './dto/create-user-role.dto';
import {
  UpdateUserDto,
  UpdateUserWithRolesInterface,
} from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    // 尝试找到用户的profile (Try to find the user's profile)
    let profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (profile) {
      // 如果找到了profile，就更新它 (If the profile is found, update it)
      profile = await this.prisma.profile.update({
        where: { id: profile.id },
        data: dto,
      });
    } else {
      // 如果没有找到profile，就创建一个新的 (If the profile is not found, create a new one)
      profile = await this.prisma.profile.create({
        data: {
          ...dto,
          userId,
        },
      });
    }

    return profile;
  }
  async findProfile(id: number) {
    return this.prisma.users.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
    // // 尝试找到用户的profile (Try to find the user's profile)
    // const profile = await this.prisma.profile.findUnique({
    //   where: { userId },
    // });
    // return profile || null;
  }

  async findUserLogs(id: number) {
    return this.prisma.logs.findMany({
      where: {
        userId: id,
      },
    });
  }

  async findLogsByGroup(id: number) {
    return this.prisma.logs.groupBy({
      by: ['result'],
      _count: {
        result: true,
      },
      where: {
        userId: id,
      },
      orderBy: {
        _count: {
          result: 'desc',
        },
        result: 'desc',
      },
      take: 3,
      skip: 2,
    });
  }

  deleteProfile(id: number) {
    return this.prisma.profile.delete({
      where: { id },
    });
  }

  // 创建用户
  async createUser(dto: CreateUserDto | CreateUserWithRolesInterface) {
    // 对密码进行加密
    dto.password = await argon2.hash(dto.password);
    return this.prisma.users.create({
      data: dto,
    });
  }
  async updateUser(dto: UpdateUserDto | UpdateUserWithRolesInterface) {
    return this.prisma.users.update({
      where: { id: dto.id },
      data: dto,
    });
  }

  // 创建用户与角色的关联关系
  createUserOnRoles(dto: CreateUserOnRolesDto | CreateUserOnRolesDto[]) {
    // 批量创建
    if (dto instanceof Array) {
      return this.prisma.usersRoles.createMany({
        data: dto,
      });
    }

    // 单个创建
    return this.prisma.usersRoles.create({
      data: dto,
    });
  }
  async findAll(dto: getUserDto) {
    const take = dto.size ? dto.size : 10;
    const skip = dto.page ? (dto.page - 1) * take : 0;
    return await this.prisma.$transaction([
      this.prisma.users.findMany({
        skip,
        take,
        where: {
          username: dto.username,
        },

        include: {
          roles: {
            where: {
              id: dto.role,
            },
          },
          profile: {
            where: {
              gender: dto.gender,
            },
          },
        },
        orderBy: transformObjToArr(dto.order || {}),
      }),
      this.prisma.users.count(),
    ]);
  }

  find(username: string) {
    return this.prisma.users.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            role: {
              include: {
                menus: true,
              },
            },
          },
        },
      },
    });
  }
  findOne(id: number) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }
  deleteUser(id: number) {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
