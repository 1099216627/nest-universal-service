import { Resource } from './../resources/entities/resource.entity';
import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Logger } from '../logger/entities/logger.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { Menu } from '../menu/entities/menu.entity';
import { Role } from '../roles/entities/roles.entity';

@Injectable()
export class CaslService {
  constructor(private readonly userService: UsersService) {}

  async forRoot(id: number) {
    const { build, can } = new AbilityBuilder(createMongoAbility);
    const permission = await this.userService.findUserPermissions(id);
    permission.forEach((item) => {
      const { action, controller } = item;
      const entity = this.getEntity(controller);
      if (entity) {
        can(action, entity);
      }
    });
    return build({
      detectSubjectType: (object) => object.constructor,
    });
  }

  getEntity(key: string) {
    const map = {
      user: User,
      menu: Menu,
      role: Role,
      log: Logger,
      resource: Resource,
    };
    if (map[key]) {
      return map[key];
    }
    return null;
  }
}
