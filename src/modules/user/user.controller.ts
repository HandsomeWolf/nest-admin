import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { getUserDto } from './dto/get-user.dto';
import { UserService } from './user.service';
import { BigIntTransformInterceptor } from '@/common/interceptors/bigint-transform.interceptor';
import { Serialize } from '@/common/decorators/serialize.decorator';
import { PublicUserDto } from './dto/public-get-users.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { AdminGuard } from '@/common/guards/admin.guard';
// import { CreateUserPipe } from './pipes/create-user.pipe';
import { CreateUserWithRolesDto } from './dto/create-user.dto';

@Controller('user')
@UseGuards(JwtGuard)
@UseInterceptors(BigIntTransformInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  getUserProfile(@Query('id', ParseIntPipe) id: number) {
    return this.userService.findProfile(id);
  }

  @Get('/logs')
  async getUserLogs(@Query('id', ParseIntPipe) id: number) {
    const res = await this.userService.findUserLogs(id);
    return res;
  }

  @Get('/logsByGroup')
  async getLogsByGroup(@Query('id', ParseIntPipe) id: number) {
    const res = await this.userService.findLogsByGroup(id);
    return res;
  }

  @Get()
  // 方法的装饰器如果有多个，则是从下往上执行
  // @UseGuards(AdminGuard)
  // @UseGuards(AuthGuard('jwt'))
  // 如果使用UseGuard传递多个守卫，则从前往后执行，如果前面的Guard没有通过，则后面的Guard不会执行
  // @UseGuards(AdminGuard)
  // TODO:不明白为什么要这样写
  @Serialize(PublicUserDto)
  getUsers(@Query() query: getUserDto) {
    return this.userService.findAll(query);
  }

  @Post()
  // TODO: async createUser(@Body(CreateUserPipe) dto: CreateUserWithRolesDto) {
  async createUser(@Body() dto: CreateUserWithRolesDto) {
    if (dto.roles && dto.roles.length > 0) {
      const roles = {
        create: dto.roles.map((role) => ({
          roleId: role,
        })),
      };
      const res = await this.userService.createUser({ ...dto, roles });
      return res;
    }
    return await this.userService.createUser(dto);
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
    @Req() req,
  ) {
    if (id === parseInt(req.user?.userId)) {
      // 说明是同一个用户在修改
      // 权限1：判断用户是否是自己
      // 权限2：判断用户是否有更新user的权限
      // 返回数据：不能包含敏感的password等信息
      const user = dto;
      return this.userService.updateUser(user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
