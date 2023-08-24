import { Roles } from '@/common/decorators/roles.decorator';
import { PrismaClient } from 'prisma/prisma-client';

const prisma = new PrismaClient();

export const getEntities = (path: string) => {
  // /users ->User , /logs -> Logs, /roles -> Roles, /menus -> Menus, /auth -> 'Auth'
  const map = {
    '/users': prisma.users,
    '/logs': prisma.logs,
    '/roles': Roles,
    '/menus': prisma.menus,
    '/auth': 'Auth',
  };

  for (let i = 0; i < Object.keys(map).length; i++) {
    const key = Object.keys(map)[i];
    if (path.startsWith(key)) {
      return map[key];
    }
  }
};
