import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserService } from '../user/user.service';
import { getEntities } from '@/utils/common';
import { Menus } from 'prisma/prisma-client';

@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}

  async forRoot(username: string) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    const user = await this.userService.find(username);
    const obj = {} as Record<string, unknown>;
    user.roles.forEach((o) => {
      o.role.menus.forEach((menu) => {
        obj[menu.id] = menu;
      });
    });
    const menus = Object.values(obj) as Menus[];
    menus.forEach((menu) => {
      const actions = menu.acl.split(',');
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        can(action, getEntities(menu.path));
      }
    });

    const ability = build({
      detectSubjectType: (object) => object.constructor.name,
    });

    return ability;
  }
}
