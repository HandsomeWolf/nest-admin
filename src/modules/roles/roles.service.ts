import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}
  createRole(dto: CreateRoleDto) {
    return this.prisma.roles.create({
      data: dto,
    });
  }

  updateRole(dto: UpdateRoleDto) {
    return this.prisma.roles.update({
      where: { id: dto.id },
      data: dto,
    });
  }

  // TODO
  findAll() {
    return this.prisma.roles.findMany();
  }
  findOne(id: number) {
    return this.prisma.roles.findUnique({
      where: { id },
    });
  }

  deteleRole(id: number) {
    return this.prisma.roles.delete({
      where: { id },
    });
  }
}
