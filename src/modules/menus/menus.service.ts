import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}
  create(createMenuDto: CreateMenuDto) {
    return this.prisma.menus.create({
      data: createMenuDto,
    });
  }

  findAll() {
    return this.prisma.menus.findMany();
  }

  findOne(id: number) {
    return this.prisma.menus.findUnique({
      where: { id },
    });
  }

  async update(updateMenuDto: UpdateMenuDto) {
    return this.prisma.menus.update({
      where: { id: updateMenuDto.id },
      data: updateMenuDto,
    });
  }

  remove(id: number) {
    return this.prisma.menus.delete({
      where: { id },
    });
  }
}
